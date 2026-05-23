// File: app/api/stripe-checkout/route.ts
// Implements: specs/database/spec.md
// Requirement: Relational Order Logging

import { env } from "@/env";
import { CONSOLE_RED_TEXT, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_OK } from "@/lib/constants/app";
import { getDb } from "@/lib/constants/mongo";
import { fetchUserCart } from "@/lib/server-actions/helper-actions";
import {
	calculateCartSubtotal,
	calculateSalesTax,
	calculateTotalPartsCost,
	calculateTotalPcbsCost,
	convertToStripeOrderAmount,
	getShippingCost,
} from "@/lib/utils";
import type { BillingAddressType, ShippingAddressType } from "@/types/address-types";
import type { CurrencyType } from "@/types/currency-types";
import Stripe from "stripe";

interface DbUserRow {
	first_name: string | null;
	last_name: string | null;
	email: string;
	billing_addresses: BillingAddressType[];
	shipping_addresses: ShippingAddressType[];
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
	const { currency } = (await request.json()) as { currency: CurrencyType | null };
	if (!currency) return new Response(null, { status: STATUS_BAD_REQUEST, statusText: "No currency provided" });

	const formattedCurrency = currency.toLowerCase();

	try {
		const supabase = getDb();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			return new Response(null, { status: 401, statusText: "Unauthorized" });
		}

		const { data: rawUserData, error: userError } = await supabase
			.from("users")
			.select("first_name, last_name, email, billing_addresses, shipping_addresses")
			.eq("id", user.id)
			.single();
		
		if (userError) throw userError;
		const userData = rawUserData as unknown as DbUserRow | null;
		if (!userData) throw new Error("User data not found");

		const cart = await fetchUserCart();
		if (cart instanceof Error) throw cart;
		if (!cart) throw new Error("Cart not found");

		const cartValue = calculateCartSubtotal(cart);
		const partsTotal = calculateTotalPartsCost(cart);
		const pcbsTotal = calculateTotalPcbsCost(cart);
		
		const shippingAddresses = Array.isArray(userData.shipping_addresses) ? userData.shipping_addresses : [];
		const billingAddresses = Array.isArray(userData.billing_addresses) ? userData.billing_addresses : [];

		const shippingAddress = shippingAddresses[0] as ShippingAddressType | undefined;
		const billingAddress = billingAddresses[0] as BillingAddressType | undefined;

		if (!shippingAddress || !billingAddress) {
			throw new Error("Addresses missing for checkout");
		}

		const shippingCountry = shippingAddress.country;
		const { pcbShippingCost, partShippingCost } = getShippingCost(shippingCountry, cart);
		const totalShippingCost = partShippingCost + pcbShippingCost;

		const tax = calculateSalesTax(cartValue + totalShippingCost);

		// create stripe customer to prefill data in checkout.
		const customer = await stripe.customers.create({
			email: billingAddress.email,
			name: (billingAddress.firstName || "") + " " + (billingAddress.lastName || ""),
			address: {
				line1: billingAddress.address1,
				line2: billingAddress.address2,
				city: billingAddress.city,
				state: billingAddress.state,
				postal_code: billingAddress.postalCode,
				country: billingAddress.country,
			},
		});

		// Create Stripe checkout session
		const session = await stripe.checkout.sessions.create({
			ui_mode: "embedded",
			customer: customer.id,
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: formattedCurrency,
						product_data: {
							name: "Components",
						},
						unit_amount: convertToStripeOrderAmount(partsTotal, currency), // Stripe expects price in cents
					},
				},
				{
					quantity: 1,
					price_data: {
						currency: formattedCurrency,
						product_data: {
							name: "Printed Circuit Boards",
						},
						unit_amount: convertToStripeOrderAmount(pcbsTotal, currency), // Stripe expects price in cents
					},
				},
				{
					quantity: 1,
					price_data: {
						currency: formattedCurrency,
						product_data: {
							name: "Shipping",
						},
						unit_amount: convertToStripeOrderAmount(totalShippingCost, currency), // Stripe expects price in cents
					},
				},
				{
					quantity: 1,
					price_data: {
						currency: formattedCurrency,
						product_data: {
							name: "Sales Tax",
						},
						unit_amount: convertToStripeOrderAmount(tax, currency), // Stripe expects price in cents
					},
				},
			],
			mode: "payment",
			return_url: `${env.NEXT_PUBLIC_APP_URL}/order-status/return?session_id={CHECKOUT_SESSION_ID}`,
		});
		return new Response(JSON.stringify({ clientSecret: session.client_secret ?? "" }), { status: STATUS_OK });
	} catch (error) {
		console.error(CONSOLE_RED_TEXT, `STRIPE CREATE CHECKOUT SESSION FAULT => ${error as string}`);
		return new Response(null, {
			status: STATUS_INTERNAL_SERVER_ERROR,
			statusText: `STRIPE CREATE CHECKOUT SESSION FAULT => ${error as string}`,
		});
	}
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const sessionId = url.searchParams.get("session_id");
	if (!sessionId) return new Response(null, { status: STATUS_BAD_REQUEST, statusText: "No session_id provided" });

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
		const paymentIntent = session.payment_intent;
		return new Response(JSON.stringify({ status: session.status, paymentIntent }), { status: STATUS_OK });
	} catch (error) {
		console.error(CONSOLE_RED_TEXT, `STRIPE GET CHECKOUT FAULT => ${error as string}`);
		return new Response(null, {
			status: STATUS_INTERNAL_SERVER_ERROR,
			statusText: "Stripe Checkout Failed.",
		});
	}
}

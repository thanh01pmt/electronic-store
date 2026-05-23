// File: lib/server-actions/checkout-actions.ts
// Implements: specs/database/spec.md
// Requirement: Relational Order Logging

"use server";
import { getDb } from "@/lib/constants/mongo";
import { ADDRESSES_PAGE, ORDER_SUCCESS_PAGE } from "@/lib/constants/page-routes";
import { createNewOpenOrder, createNewOrder, resetCart } from "@/lib/server-actions/helper-actions";
import type { BillingAddressType, ShippingAddressType, FetchAddressesPropsType, NewAddressPropsType } from "@/types/address-types";
import type { CurrencyType } from "@/types/currency-types";
import { revalidatePath } from "next/cache";

interface DbUserRow {
	billing_addresses: BillingAddressType[];
	shipping_addresses: ShippingAddressType[];
}

export async function addAddressesAction(props: NewAddressPropsType): Promise<void> {
	const { billingAddress, shippingAddress } = props;
	try {
		const supabase = getDb();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error("UNAUTHORIZED");

		const { data, error: fetchError } = await supabase
			.from("users")
			.select("billing_addresses, shipping_addresses")
			.eq("id", user.id)
			.single();
		
		if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
		const userData = data as unknown as DbUserRow | null;

		const billing = userData?.billing_addresses ?? [];
		const shipping = userData?.shipping_addresses ?? [];

		const updatedBilling = [billingAddress, ...billing].slice(0, 2);
		const updatedShipping = [shippingAddress, ...shipping].slice(0, 2);

		const { error: updateError } = await supabase
			.from("users")
			.update({
				billing_addresses: updatedBilling,
				shipping_addresses: updatedShipping,
			})
			.eq("id", user.id);
		
		if (updateError) throw updateError;

		revalidatePath(ADDRESSES_PAGE);
		return;
	} catch (error) {
		throw error;
	}
}

export async function fetchAddressesAction(): Promise<FetchAddressesPropsType | null> {
	try {
		const supabase = getDb();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return null;

		const { data, error } = await supabase
			.from("users")
			.select("billing_addresses, shipping_addresses")
			.eq("id", user.id)
			.single();
		
		if (error) {
			if (error.code === "PGRST116") return null;
			throw error;
		}
		const userData = data as unknown as DbUserRow;

		return {
			billingAddresses: userData.billing_addresses,
			shippingAddresses: userData.shipping_addresses,
		};
	} catch (error) {
		throw error;
	}
}

export async function captureOrderDetailsAction(props: { paymentId: string; currency: CurrencyType }): Promise<void> {
	try {
		const newOrder = await createNewOrder(props);
		if (newOrder instanceof Error) throw newOrder;
		const newOpenOrder = await createNewOpenOrder(newOrder);
		if (newOpenOrder instanceof Error) throw newOpenOrder;
		const cartReset = await resetCart();
		if (cartReset instanceof Error) throw cartReset;
		revalidatePath(ORDER_SUCCESS_PAGE, "layout");
		return;
	} catch (error) {
		throw error;
	}
}

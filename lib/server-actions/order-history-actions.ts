// File: lib/server-actions/order-history-actions.ts
// Implements: specs/database/spec.md
// Requirement: Relational Order Logging

"use server";
import { createClient } from "@/lib/utils/supabase-server";
import type { BillingAddressType, ShippingAddressType } from "@/types/address-types";
import type { CartDataType } from "@/types/cart-types";
import type { CurrencyType } from "@/types/currency-types";
import type { OrderStatusType, OrderType } from "@/types/order-types";

interface DbOrderRow {
	id: string;
	created_at: string;
	status: string;
	cart_value: number;
	tax: number;
	shipping_cost: number;
	cart_total: number;
	payment_id: string;
	shipper: string | null;
	awb: string | null;
	billing_address: unknown;
	shipping_address: unknown;
	cart_snapshot: unknown;
	remarks: string | null;
	currency: string;
	exchange_rate: number;
}

export async function fetchUserOrdersAction(): Promise<OrderType[]> {
	try {
		const supabase = createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error("UNAUTHORIZED");

		const { data, error } = await supabase
			.from("orders")
			.select("*")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });
		
		if (error) throw error;

		const dbOrders = data as unknown as DbOrderRow[];

		return dbOrders.map(order => ({
			id: order.id,
			createdAt: new Date(order.created_at),
			status: order.status as OrderStatusType,
			cartValue: Number(order.cart_value),
			discountCode: "NA",
			discountValue: 0,
			tax: Number(order.tax),
			shippingCost: Number(order.shipping_cost),
			cartTotal: Number(order.cart_total),
			paymentId: order.payment_id,
			shipper: order.shipper,
			awb: order.awb,
			billingAddress: order.billing_address as BillingAddressType,
			shippingAddress: order.shipping_address as ShippingAddressType,
			cart: order.cart_snapshot as CartDataType,
			remarks: order.remarks ?? null,
			currency: order.currency as CurrencyType,
			exchangeRate: Number(order.exchange_rate),
		}));
	} catch (error) {
		throw error;
	}
}

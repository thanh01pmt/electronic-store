// File: lib/server-actions/helper-actions.ts
// Implements: specs/database/spec.md
// Implements: specs/storage/spec.md
// Requirement: Database Cart Sync
// Requirement: Guest Cart Merge
// Requirement: Relational Order Logging
// Requirement: Design File Relocation

"use server";
import { getDb } from "@/lib/constants/mongo";
import { CONSOLE_RED_TEXT, DIR_PATH_DELIMITER } from "@/lib/constants/app";
import { ORDER_NOTIFICATION_EMAIL_ENDPOINT } from "@/lib/constants/page-routes";
import {
	calculateCartSubtotal,
	calculateSalesTax,
	getAllPcbs,
	getShippingCost,
	handleApiRequestError,
	setExchangeRateForCurrency,
} from "@/lib/utils";
import type { BillingAddressType, ShippingAddressType } from "@/types/address-types";
import type { ParsedBomDataObjectType } from "@/types/bom-parser-types";
import type { CartDataType, CartItemType, CartItemsType } from "@/types/cart-types";
import type { CurrencyType } from "@/types/currency-types";
import type { OrderType } from "@/types/order-types";
import type { SignupPropsType, UserType } from "@/types/user-types";
import { cookies } from "next/headers";
import orderId from "order-id";
import Papa, { type ParseResult } from "papaparse";
import ShortUniqueId from "short-unique-id";

interface DbUserRow {
	id: string;
	email: string;
	first_name: string | null;
	last_name: string | null;
	s3_file_dir: string | null;
	billing_addresses: BillingAddressType[];
	shipping_addresses: ShippingAddressType[];
}

interface DbCartRow {
	id: string;
	user_id: string | null;
	cart_id: string | null;
	cart_size: number;
	created_at: string;
	updated_at: string;
}

interface DbCartItemRow {
	id: string;
	cart_id: string;
	name: string;
	type: string;
	ordered_qty: number;
	details: Record<string, unknown>;
	created_at: string;
}

export async function createNewUser(props: SignupPropsType): Promise<UserType> {
	const { email, firstName, lastName, userId } = props;
	const supabase = getDb();
	const { error } = await supabase.from("users").insert({
		id: userId,
		email,
		first_name: firstName,
		last_name: lastName,
		s3_file_dir: null,
	});
	if (error) throw error;
	return {
		createdAt: new Date(),
		userId,
		email,
		firstName,
		lastName,
		billingAddresses: [],
		shippingAddresses: [],
		cart: {
			cartSize: 0,
			cartItems: [],
		},
		s3FileDir: null,
		orders: [],
	};
}

export async function mergeUserAndGuestCarts(userCart: CartDataType, guestCart: CartDataType): Promise<CartDataType> {
	guestCart.cartItems.forEach(guestCartItem => {
		const existingItem = userCart.cartItems.find(
			userCartItem => userCartItem.Type === guestCartItem.Type && userCartItem.Name === guestCartItem.Name
		);
		if (existingItem) {
			existingItem.OrderedQty = guestCartItem.OrderedQty; // update qty
		} else {
			userCart.cartItems.push(guestCartItem);
			userCart.cartSize++;
		}
		userCart.updatedAt = guestCart.updatedAt;
	});
	return userCart;
}

/*
 * If there are PCBs in the guest cart, then design files need to be transferred to the user's storage directory after login.
 * Get user's Storage directory name from the database and copy files from guest Storage directory to user's Storage directory and delete guest Storage directory.
 * If user's Storage directory name is null (new signup or first time user), copy guest Storage directory name to user's Storage directory name.
 */
export async function relocatePcbDesignFilesInS3Bucket(guestCart: CartDataType): Promise<null | Error> {
	const guestCartPcbs = getAllPcbs(guestCart);
	if (!guestCartPcbs.length) return null;

	try {
		const cartIdCookie = cookies().get("cartId");
		if (!cartIdCookie) throw new Error("CART ID COOKIE MISSING");
		const guestS3DirName = cartIdCookie.value;

		const supabase = getDb();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error("UNAUTHORIZED");

		const { data, error: fetchError } = await supabase
			.from("users")
			.select("s3_file_dir")
			.eq("id", user.id)
			.single();
		
		if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
		const userData = data as DbUserRow | null;

		if (userData?.s3_file_dir) {
			// copy files from guest directory to user's directory in Supabase Storage
			const userS3DirName = userData.s3_file_dir;
			await copyFilesFromSourceToDestination(guestS3DirName, userS3DirName);
			await deleteFilesInSourceDirectory(guestS3DirName);
		} else {
			// user's directory name is null (new user), copy guest directory name to user's directory name
			const { error: updateError } = await supabase
				.from("users")
				.update({ s3_file_dir: guestS3DirName })
				.eq("id", user.id);
			if (updateError) throw updateError;
		}
		return null;
	} catch (error) {
		return handleApiRequestError(error, "RELOCATE PCB DESIGN FILES FAULT");
	}
}

async function copyFilesFromSourceToDestination(sourceDir: string, destinationDir: string): Promise<null | Error> {
	try {
		const supabase = getDb();
		// list all objects in the source directory
		const { data: files, error: listError } = await supabase.storage
			.from("pcb-designs")
			.list(sourceDir);
		if (listError) throw listError;
		if (files.length === 0) return null;

		// copy each object to the destination directory
		for (const file of files) {
			const { error: copyError } = await supabase.storage
				.from("pcb-designs")
				.copy(`${sourceDir}/${file.name}`, `${destinationDir}/${file.name}`);
			if (copyError) throw copyError;
		}
		return null;
	} catch (error) {
		return handleApiRequestError(error, "COPY FILES FROM SOURCE TO DESTINATION FAULT");
	}
}

export async function deleteFilesInSourceDirectory(foldername: string): Promise<null | Error> {
	try {
		const supabase = getDb();
		// list all objects in the source directory
		const { data: files, error: listError } = await supabase.storage
			.from("pcb-designs")
			.list(foldername);
		if (listError) throw listError;
		if (files.length === 0) return null;

		// delete each object in the source directory
		const filesToDelete = files.map(file => `${foldername}/${file.name}`);
		const result = await supabase.storage
			.from("pcb-designs")
			.remove(filesToDelete);
		if (result.error) throw result.error;

		return null;
	} catch (error) {
		return handleApiRequestError(error, "DELETE FILES IN SOURCE DIRECTORY FAULT");
	}
}

export async function updateCartInDB(cart: CartDataType): Promise<null | Error> {
	try {
		const supabase = getDb();
		const { data: { user } } = await supabase.auth.getUser();
		const cartIdCookie = cookies().get("cartId");

		let cartRecordId: string | null = null;

		if (user) {
			// Find user's cart
			const { data, error } = await supabase
				.from("carts")
				.select("id")
				.eq("user_id", user.id)
				.single();
			
			if (error && error.code !== "PGRST116") throw error;
			const existingCart = data as DbCartRow | null;

			if (existingCart) {
				cartRecordId = existingCart.id;
				const { error: updateError } = await supabase
					.from("carts")
					.update({ cart_size: cart.cartSize, updated_at: new Date() })
					.eq("id", cartRecordId);
				if (updateError) throw updateError;
			} else {
				// Create new cart for user
				const { data: newData, error: createError } = await supabase
					.from("carts")
					.insert({ user_id: user.id, cart_size: cart.cartSize })
					.select("id")
					.single();
				if (createError) throw createError;
				const newCart = newData as DbCartRow;
				cartRecordId = newCart.id;
			}
		} else if (cartIdCookie) {
			// Find guest's cart
			const { data, error } = await supabase
				.from("carts")
				.select("id")
				.eq("cart_id", cartIdCookie.value)
				.single();
			
			if (error && error.code !== "PGRST116") throw error;
			const existingCart = data as DbCartRow | null;

			if (existingCart) {
				cartRecordId = existingCart.id;
				const { error: updateError } = await supabase
					.from("carts")
					.update({ cart_size: cart.cartSize, updated_at: new Date() })
					.eq("id", cartRecordId);
				if (updateError) throw updateError;
			} else {
				// Create new guest cart
				const { data: newData, error: createError } = await supabase
					.from("carts")
					.insert({ cart_id: cartIdCookie.value, cart_size: cart.cartSize })
					.select("id")
					.single();
				if (createError) throw createError;
				const newCart = newData as DbCartRow;
				cartRecordId = newCart.id;
			}
		}

		if (!cartRecordId) throw new Error("NO ACTIVE CART FOUND FOR UPDATE");

		// Clear old cart items
		const { error: deleteError } = await supabase
			.from("cart_items")
			.delete()
			.eq("cart_id", cartRecordId);
		if (deleteError) throw deleteError;

		// Insert new cart items
		if (cart.cartItems.length > 0) {
			const itemsToInsert = cart.cartItems.map(item => {
				const { Name, Type, OrderedQty, ...details } = item;
				return {
					cart_id: cartRecordId,
					name: Name,
					type: Type,
					ordered_qty: OrderedQty,
					details: details
				};
			});
			const { error: insertError } = await supabase
				.from("cart_items")
				.insert(itemsToInsert);
			if (insertError) throw insertError;
		}

		return null;
	} catch (error) {
		return handleApiRequestError(error, "UPDATE CART IN DB FAULT");
	}
}

export async function fetchGuestCart(): Promise<CartDataType | null | Error> {
	try {
		const supabase = getDb();
		const cartIdCookie = cookies().get("cartId");
		const cartId = cartIdCookie?.value;
		if (!cartId) return null;

		const { data: rawCart, error: cartError } = await supabase
			.from("carts")
			.select("id, cart_size")
			.eq("cart_id", cartId)
			.single();

		if (cartError) {
			if (cartError.code === "PGRST116") return null;
			throw cartError;
		}
		const cartData = rawCart as DbCartRow;

		const { data: rawItems, error: itemsError } = await supabase
			.from("cart_items")
			.select("name, type, ordered_qty, details")
			.eq("cart_id", cartData.id);

		if (itemsError) throw itemsError;
		const itemsData = rawItems as unknown as DbCartItemRow[];

		return {
			cartSize: cartData.cart_size,
			cartItems: itemsData.map(item => ({
				Name: item.name,
				Type: item.type as "Part" | "PCB",
				OrderedQty: item.ordered_qty,
				...item.details
			} as unknown as CartItemType))
		};
	} catch (error) {
		return handleApiRequestError(error, "FETCH GUEST CART FAULT");
	}
}

export async function cleanupGuestCart(): Promise<null | Error> {
	try {
		const supabase = getDb();
		const cartIdCookie = cookies().get("cartId");
		const cartId = cartIdCookie?.value;
		if (cartId) {
			const { error } = await supabase
				.from("carts")
				.delete()
				.eq("cart_id", cartId);
			if (error) throw error;
		}
		cookies().set("cartId", "", { maxAge: 0 }); // delete cookie
		return null;
	} catch (error) {
		return handleApiRequestError(error, "CLEANUP GUEST CART FAULT");
	}
}

export async function fetchUserCart(): Promise<CartDataType | null | Error> {
	try {
		const supabase = getDb();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return null;

		const { data: rawCart, error: cartError } = await supabase
			.from("carts")
			.select("id, cart_size")
			.eq("user_id", user.id)
			.single();

		if (cartError) {
			if (cartError.code === "PGRST116") return null;
			throw cartError;
		}
		const cartData = rawCart as DbCartRow;

		const { data: rawItems, error: itemsError } = await supabase
			.from("cart_items")
			.select("name, type, ordered_qty, details")
			.eq("cart_id", cartData.id);

		if (itemsError) throw itemsError;
		const itemsData = rawItems as unknown as DbCartItemRow[];

		return {
			cartSize: cartData.cart_size,
			cartItems: itemsData.map(item => ({
				Name: item.name,
				Type: item.type as "Part" | "PCB",
				OrderedQty: item.ordered_qty,
				...item.details
			} as unknown as CartItemType))
		};
	} catch (error) {
		return handleApiRequestError(error, "FETCH USER CART FAULT");
	}
}

export async function insertOrUpdateCartItem(currentCart: CartDataType, item: CartItemType): Promise<void> {
	const existingItem = currentCart.cartItems.find(
		cartItem => cartItem.Type === item.Type && cartItem.Name === item.Name
	);
	if (existingItem) {
		existingItem.OrderedQty += item.OrderedQty;
		currentCart.updatedAt = new Date();
	} else {
		currentCart.updatedAt = new Date();
		currentCart.cartItems.push(item);
		currentCart.cartSize++;
	}
	return;
}

export async function createGuestCartWithItem(props: CartItemType): Promise<CartDataType> {
	return {
		createdAt: new Date(),
		updatedAt: new Date(),
		cartSize: 1,
		cartItems: [props],
	};
}

export async function createNewCartInDB(cart: CartDataType): Promise<null | Error> {
	try {
		const supabase = getDb();
		const cartIdCookie = cookies().get("cartId");
		const cartId = cartIdCookie ? cartIdCookie.value : new ShortUniqueId({ length: 8 }).randomUUID();
		await createCartCookie(cartId); // future reference

		const { data: rawCart, error: createError } = await supabase
			.from("carts")
			.insert({ cart_id: cartId, cart_size: cart.cartSize })
			.select("id")
			.single();
		if (createError) throw createError;
		const newCart = rawCart as DbCartRow;

		if (cart.cartItems.length > 0) {
			const itemsToInsert = cart.cartItems.map(item => {
				const { Name, Type, OrderedQty, ...details } = item;
				return {
					cart_id: newCart.id,
					name: Name,
					type: Type,
					ordered_qty: OrderedQty,
					details: details
				};
			});
			const { error: insertError } = await supabase
				.from("cart_items")
				.insert(itemsToInsert);
			if (insertError) throw insertError;
		}

		return null;
	} catch (error) {
		return handleApiRequestError(error, "CREATE NEW CART IN DB FAULT");
	}
}

export async function createCartCookie(cartId: string): Promise<void> {
	cookies().set({
		name: "cartId",
		value: cartId,
		path: "/",
		maxAge: 60 * 60 * 24 * 30, // one month
		sameSite: true,
		secure: true,
	});
	return;
}

export async function filterCartItemsByName(cart: CartDataType, itemName: string): Promise<CartItemsType> {
	return cart.cartItems.filter(cartItem => cartItem.Name !== itemName);
}

export async function filterCartItemsByType(cart: CartDataType, itemType: "Part" | "PCB"): Promise<CartItemsType> {
	return cart.cartItems.filter(cartItem => cartItem.Type !== itemType);
}

// for order history
export async function createNewOrder(props: { paymentId: string; currency: CurrencyType }): Promise<OrderType | Error> {
	const { paymentId, currency } = props;
	const supabase = getDb();
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error("USER NOT FOUND");

		const { data: rawUser, error: userError } = await supabase
			.from("users")
			.select("first_name, last_name, email, billing_addresses, shipping_addresses")
			.eq("id", user.id)
			.single();
		if (userError) throw userError;
		const userData = rawUser as DbUserRow;

		const cart = await fetchUserCart();
		if (cart instanceof Error) throw cart;
		if (!cart) throw new Error("CART NOT FOUND");

		const cartSubtotal = calculateCartSubtotal(cart);
		
		const billingAddresses = Array.isArray(userData.billing_addresses) ? userData.billing_addresses : [];
		const shippingAddresses = Array.isArray(userData.shipping_addresses) ? userData.shipping_addresses : [];

		const billingAddress = billingAddresses.length > 0 ? billingAddresses[0] : null;
		const shippingAddress = shippingAddresses.length > 0 ? shippingAddresses[0] : null;
		
		if (!shippingAddress || !billingAddress) throw new Error("ADDRESSES MISSING FOR CHECKOUT");

		const shippingCountry = shippingAddress.country;
		const { partShippingCost, pcbShippingCost } = getShippingCost(shippingCountry, cart);
		const totalShippingCost = partShippingCost + pcbShippingCost;
		const tax = calculateSalesTax(cartSubtotal + totalShippingCost);
		const totalOrderValue = cartSubtotal + totalShippingCost + tax;

		const newOrderId = orderId(paymentId).generate();

		const newOrder: OrderType = {
			id: newOrderId,
			createdAt: new Date(),
			status: "Placed",
			cartValue: cartSubtotal,
			discountCode: "NA",
			discountValue: 0,
			tax,
			shippingCost: totalShippingCost,
			cartTotal: totalOrderValue,
			paymentId,
			shipper: null,
			awb: null,
			billingAddress,
			shippingAddress,
			cart,
			remarks: null,
			currency,
			exchangeRate: setExchangeRateForCurrency(currency),
		};

		// send order confirmation email to customer
		await fetch(ORDER_NOTIFICATION_EMAIL_ENDPOINT, {
			method: "POST",
			body: JSON.stringify(newOrder),
		});

		const { error: orderError } = await supabase.from("orders").insert({
			id: newOrderId,
			user_id: user.id,
			status: "Placed",
			cart_value: cartSubtotal,
			tax,
			shipping_cost: totalShippingCost,
			cart_total: totalOrderValue,
			payment_id: paymentId,
			shipper: null,
			awb: null,
			billing_address: billingAddress,
			shipping_address: shippingAddress,
			cart_snapshot: cart,
			currency,
			exchange_rate: setExchangeRateForCurrency(currency),
			created_at: new Date()
		});
		if (orderError) throw orderError;

		return newOrder;
	} catch (error) {
		return handleApiRequestError(error, "CREATE NEW ORDER FAULT");
	}
}

// for admin use
export async function createNewOpenOrder(_newOrder: OrderType): Promise<null | Error> {
	try {
		return null;
	} catch (error) {
		return handleApiRequestError(error, "CREATE NEW OPEN ORDER FAULT");
	}
}

export async function resetCart(): Promise<null | Error> {
	try {
		const supabase = getDb();
		const { data: { user } } = await supabase.auth.getUser();
		if (user) {
			const { data, error } = await supabase
				.from("carts")
				.select("id")
				.eq("user_id", user.id)
				.single();
			
			if (error && error.code !== "PGRST116") throw error;
			const existingCart = data as DbCartRow | null;

			if (existingCart) {
				const { error: updateError } = await supabase
					.from("carts")
					.update({ cart_size: 0, updated_at: new Date() })
					.eq("id", existingCart.id);
				if (updateError) throw updateError;

				const { error: deleteError } = await supabase
					.from("cart_items")
					.delete()
					.eq("cart_id", existingCart.id);
				if (deleteError) throw deleteError;
			}
		}
		return null;
	} catch (error) {
		return handleApiRequestError(error, "RESET CART FAULT");
	}
}

/*
 * If no userId or cartId cookie is found, new guest cart is created and its cartId is used as the foldername.
 * if cartId cookie is found, then its value is the associated foldername in the storage bucket.
 * if userId is found:
 *   - if user just signed up, foldername in db will be null. In that case, new foldername is created (cartId) and associated with the user.
 *   - if user already has a foldername (from past use), then that foldername is used.
 */
export async function getFoldername(): Promise<string | Error> {
	let foldername = DIR_PATH_DELIMITER; // init => start with file separator.
	const supabase = getDb();

	const { data: { user } } = await supabase.auth.getUser();
	const cartIdCookie = cookies().get("cartId");
	const newCartId = new ShortUniqueId({ length: 8 }).randomUUID();

	try {
		if (!user && !cartIdCookie) {
			// create new guest cart and its associated foldername
			await createCartCookie(newCartId);
			
			const { error: createError } = await supabase
				.from("carts")
				.insert({ cart_id: newCartId, cart_size: 0 });
			if (createError) throw createError;

			foldername = newCartId + DIR_PATH_DELIMITER;
			return foldername;
		}
	} catch (error) {
		return handleApiRequestError(error, "ASSIGN NEW FOLDERNAME FAULT");
	}

	try {
		if (user) {
			const { data, error: fetchError } = await supabase
				.from("users")
				.select("s3_file_dir")
				.eq("id", user.id)
				.single();
			if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
			const userData = data as DbUserRow | null;

			// check if user has a foldername associated with their account
			if (userData?.s3_file_dir) {
				foldername = userData.s3_file_dir + DIR_PATH_DELIMITER;
			} else {
				foldername = newCartId + DIR_PATH_DELIMITER;
				const { error: updateError } = await supabase
					.from("users")
					.update({ s3_file_dir: newCartId })
					.eq("id", user.id);
				if (updateError) throw updateError;
			}
			return foldername;
		}
	} catch (error) {
		return handleApiRequestError(error, "GET/SET USER FOLDERNAME FAULT");
	}

	try {
		if (cartIdCookie) {
			foldername = cartIdCookie.value + DIR_PATH_DELIMITER;
		}
		return foldername;
	} catch (error) {
		return handleApiRequestError(error, "GET GUEST FOLDERNAME FAULT");
	}
}

// bom parser
export default async function parseCsvFile(file: File): Promise<ParsedBomDataObjectType[]> {
	try {
		const fileData = await file.text();
		const config = {
			header: true,
			skipEmptyLines: true,
			delimiter: ",",
		};
		const csv: ParseResult<unknown> = Papa.parse(fileData, config);
		if (csv.errors.length > 0) {
			csv.errors.forEach(error => {
				throw new Error(`${error.message} at row ${error.row}`);
			});
		}
		return csv.data as ParsedBomDataObjectType[];
	} catch (error) {
		console.error(CONSOLE_RED_TEXT, `PARSE CSV FILE FAULT => ${error as string}`);
		throw error;
	}
}

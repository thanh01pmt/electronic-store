// File: app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { transferGuestCartToUserAction } from "@/lib/server-actions/cart-actions";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const cookieStore = cookies();
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		if (!supabaseUrl || !supabaseAnonKey) {
			return NextResponse.redirect(`${origin}/`);
		}

		const supabase = createServerClient(
			supabaseUrl,
			supabaseAnonKey,
			{
				cookies: {
					getAll() {
						return cookieStore.getAll();
					},
					setAll(cookiesToSet) {
						try {
							cookiesToSet.forEach(({ name, value, options }) =>
								cookieStore.set(name, value, options)
							);
						} catch {
							// Ignored when called from Server Components during static analysis/rendering
						}
					},
				},
			}
		);
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			// Transfer cart items if guest cart exists
			try {
				await transferGuestCartToUserAction();
			} catch (err) {
				console.error("Failed to transfer guest cart on OAuth callback", err);
			}
			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// Return the user to an error page or homepage if it fails
	return NextResponse.redirect(`${origin}/`);
}

// File: middleware.ts
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

import { AUTH_PAGES } from "@/lib/constants/page-routes";
import { updateSession } from "@/lib/utils/supabase-middleware";
import { NextResponse, type NextRequest } from "next/server";

const privateRoutes = ["account", "checkout", "order-history", "order-status"];

export async function middleware(request: NextRequest) {
	// Update user's Supabase session cookie on request
	const { supabase, response } = updateSession(request);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isPrivateRoute = privateRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(`/${route}`)
	);

	// Redirect unauthenticated users trying to access private routes
	if (!user && isPrivateRoute) {
		const login = new URL("/auth/login", request.url);
		return NextResponse.redirect(login);
	}

	// Redirect authenticated users trying to access auth pages back to home
	if (user && request.nextUrl.pathname.includes(AUTH_PAGES)) {
		const home = new URL("/", request.url);
		return NextResponse.redirect(home);
	}

	return response;
}

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
};

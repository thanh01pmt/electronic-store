// File: lib/utils/supabase-client.ts
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

export function createClient() {
	return createBrowserClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);
}

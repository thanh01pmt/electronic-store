// File: lib/constants/mongo.ts
// Implements: specs/database/spec.md
// Requirement: Database Cart Sync

import { createClient } from "@/lib/utils/supabase-server";

// Helper function to get the Supabase Client on the server side
export function getDb() {
	return createClient();
}

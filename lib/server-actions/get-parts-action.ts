// File: lib/server-actions/get-parts-action.ts
// Implements: specs/database/spec.md
// Requirement: Parts Cache

"use server";
import { CONSOLE_GREEN_TEXT, MAX_PART_REQUESTS_PER_MIN, PARTS_API_ENDPOINT } from "@/lib/constants/app";
import { getDb } from "@/lib/constants/mongo";
import { apiRequestRateLimiter } from "@/lib/utils";
import type { PartResultsType } from "@/types/part-types";

let requestCount = 0;

export async function getPartsAction(partName: string): Promise<PartResultsType | null> {
	try {
		const supabase = getDb();
		const { data } = await supabase
			.from("parts_cache")
			.select("parts_data, created_at")
			.eq("part_name", partName)
			.single();
		
		if (data) {
			const createdAt = new Date(data.created_at as string);
			const isExpired = Date.now() - createdAt.getTime() > 1000 * 60 * 60 * 24; // 1 day expiration
			if (!isExpired) {
				console.log(CONSOLE_GREEN_TEXT, "GETTING DATA FROM CACHE");
				return data.parts_data as unknown as PartResultsType;
			} else {
				// delete expired cache entry asynchronously
				void supabase.from("parts_cache").delete().eq("part_name", partName);
			}
		}

		console.log(CONSOLE_GREEN_TEXT, "FETCHING DATA FROM API");

		// rate limits for BOM parser
		await apiRequestRateLimiter(requestCount, MAX_PART_REQUESTS_PER_MIN);
		requestCount = (requestCount + 1) % MAX_PART_REQUESTS_PER_MIN;

		const response = await fetch(PARTS_API_ENDPOINT + partName);
		if (!response.ok) throw new Error(response.statusText);

		const partsData = (await response.json()) as PartResultsType;

		// cache data (upsert)
		const { error: cacheError } = await supabase
			.from("parts_cache")
			.upsert({
				part_name: partName,
				parts_data: partsData,
				created_at: new Date()
			});
		
		if (cacheError) console.error("Cache write error:", cacheError);

		return partsData;
	} catch (error) {
		throw error;
	}
}

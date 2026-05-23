// File: lib/server-actions/storage-actions.ts
// Implements: specs/storage/spec.md
// Requirement: Design File Upload

"use server";
import { createClient } from "@/lib/utils/supabase-server";
import { cookies } from "next/headers";
import { DIR_PATH_DELIMITER, ZIP_FILE_EXTENSION } from "@/lib/constants/app";

export async function deleteDesignFileFromS3(itemName: string): Promise<void> {
	try {
		const supabase = createClient();
		let foldername: string | null = null;

		const { data: { user } } = await supabase.auth.getUser();
		const cartIdCookie = cookies().get("cartId");

		if (user) {
			const { data, error } = await supabase
				.from("users")
				.select("s3_file_dir")
				.eq("id", user.id)
				.single();
			
			if (error && error.code !== "PGRST116") throw error;
			const userData = data as { s3_file_dir: string | null } | null;
			foldername = userData?.s3_file_dir ? userData.s3_file_dir + DIR_PATH_DELIMITER : null;
		}

		if (cartIdCookie) {
			foldername = cartIdCookie.value + DIR_PATH_DELIMITER;
		}
		
		if (!foldername) return;

		const filename = foldername + itemName + ZIP_FILE_EXTENSION;
		const result = await supabase.storage
			.from("pcb-designs")
			.remove([filename]);
		
		if (result.error) throw result.error;
	} catch (error) {
		throw error;
	}
}

export async function deleteAllDesignFilesFromS3(): Promise<void> {
	try {
		const supabase = createClient();
		let foldername: string | null = null;

		const { data: { user } } = await supabase.auth.getUser();
		const cartIdCookie = cookies().get("cartId");

		if (user) {
			const { data, error } = await supabase
				.from("users")
				.select("s3_file_dir")
				.eq("id", user.id)
				.single();
			
			if (error && error.code !== "PGRST116") throw error;
			const userData = data as { s3_file_dir: string | null } | null;
			foldername = userData?.s3_file_dir ?? null;
		}

		if (cartIdCookie) {
			foldername = cartIdCookie.value;
		}
		
		if (!foldername) return;

		const { data: files, error: listError } = await supabase.storage
			.from("pcb-designs")
			.list(foldername);
		
		if (listError) throw listError;
		if (files.length === 0) return;

		const filesToDelete = files.map(file => `${foldername}/${file.name}`);
		const result = await supabase.storage
			.from("pcb-designs")
			.remove(filesToDelete);
		
		if (result.error) throw result.error;
	} catch (error) {
		throw error;
	}
}

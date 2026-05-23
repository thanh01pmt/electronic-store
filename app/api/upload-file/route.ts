// File: app/api/upload-file/route.ts
// Implements: specs/storage/spec.md
// Requirement: Design File Upload

import { getDb } from "@/lib/constants/mongo";
import { getFoldername } from "@/lib/server-actions/helper-actions";
import {
	CONSOLE_RED_TEXT,
	STATUS_BAD_REQUEST,
	STATUS_INTERNAL_SERVER_ERROR,
	STATUS_OK,
	ZIP_FILE_EXTENSION,
} from "@/lib/constants/app";

export async function POST(request: Request) {
	const formData = await request.formData();
	const file = formData.get("file") as File | null;

	if (!file) return new Response(null, { status: STATUS_BAD_REQUEST, statusText: "No file provided" });

	try {
		const filename = file.name + ZIP_FILE_EXTENSION; // default
		const foldername = await getFoldername();

		if (foldername instanceof Error) {
			return new Response(null, { status: STATUS_INTERNAL_SERVER_ERROR, statusText: foldername.message });
		}

		const supabase = getDb();
		const filePath = foldername + filename;

		const { error: uploadError } = await supabase.storage
			.from("pcb-designs")
			.upload(filePath, file, {
				contentType: file.type,
				upsert: true,
			});

		if (uploadError) throw uploadError;

		const { data: signedUrlData, error: signedUrlError } = await supabase.storage
			.from("pcb-designs")
			.createSignedUrl(filePath, 60 * 60 * 24);

		if (signedUrlError) throw signedUrlError;

		return new Response(JSON.stringify({ filename, fileUrl: signedUrlData.signedUrl }), { status: STATUS_OK });
	} catch (error) {
		console.error(CONSOLE_RED_TEXT, `UPLOAD FILE FAULT => ${error as string}`);
		return new Response(null, { status: STATUS_INTERNAL_SERVER_ERROR, statusText: "Something went wrong" });
	}
}

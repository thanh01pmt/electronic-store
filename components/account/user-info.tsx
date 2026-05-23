// File: components/account/user-info.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/utils/supabase-server";

export async function UserInfo() {
	const supabase = createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return null;

	const email = user.email;
	const metadata = user.user_metadata as Record<string, string> | undefined;
	const fname = metadata?.first_name ?? metadata?.firstName ?? "";
	const lname = metadata?.last_name ?? metadata?.lastName ?? "";

	return (
		<Table>
			<TableBody>
				<TableRow className="border-b-0">
					<TableCell className="py-2 pr-4 font-semibold">Email</TableCell>
					<TableCell className="py-2 pl-4">{email}</TableCell>
				</TableRow>
				<TableRow className="border-b-0">
					<TableCell className="py-2 pr-4 font-semibold">First Name</TableCell>
					<TableCell className="py-2 pl-4">{fname}</TableCell>
				</TableRow>
				<TableRow className="border-b-0">
					<TableCell className="py-2 pr-4 font-semibold">Last Name</TableCell>
					<TableCell className="py-2 pl-4">{lname}</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}

// File: components/header/menu/user-menu.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import { UserAvatar } from "@/components/header/avatar/user-avatar";
import { AuthContext } from "@/context/auth-context";
import { ACCOUNT_PAGE, ORDER_HISTORY_PAGE } from "@/lib/constants/page-routes";
import { createClient } from "@/lib/utils/supabase-client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/navigation";

export function UserMenu() {
	const { isSignedIn } = useContext(AuthContext);
	const supabase = createClient();
	const router = useRouter();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.refresh();
		router.push("/");
	};

	return (
		<div hidden={!isSignedIn}>
			<div className="flex items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							data-testid="user-menu-trigger-button"
							variant={"ghost"}
							size={"icon"}>
							<UserAvatar />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="w-56">
						<DropdownMenuItem asChild>
							<Link href={ACCOUNT_PAGE}>Account</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={ORDER_HISTORY_PAGE}>Order History</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleSignOut}
							data-testid="logout-button">
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

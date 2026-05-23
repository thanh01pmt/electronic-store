// File: components/header/avatar/user-avatar.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitialsFromFullName } from "@/lib/utils";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

export function UserAvatar() {
	const { isSignedIn, user } = useContext(AuthContext);
	let initials = "";

	const metadata = user?.user_metadata as Record<string, string> | undefined;
	const firstName = metadata?.first_name ?? metadata?.firstName ?? "";
	const lastName = metadata?.last_name ?? metadata?.lastName ?? "";

	if (isSignedIn && firstName && lastName) {
		initials = getInitialsFromFullName(firstName, lastName);
	} else if (isSignedIn && user?.email) {
		initials = user.email.slice(0, 2).toUpperCase();
	}

	return (
		<Avatar>
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
	);
}

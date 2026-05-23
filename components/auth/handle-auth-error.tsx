// File: components/auth/handle-auth-error.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import { useToast } from "@/components/ui/use-toast";
import { CONSOLE_RED_TEXT } from "@/lib/constants/app";

export function useHandleAuthError() {
	const { toast } = useToast();
	return (err: unknown, title: string) => {
		let errorMessage: string | undefined = "Something went wrong, please try again later.";
		if (err instanceof Error) {
			errorMessage = err.message;
		} else if (err && typeof err === "object" && "message" in err) {
			errorMessage = (err as { message: string }).message;
		}
		console.error(CONSOLE_RED_TEXT, `${title} => ${errorMessage}`);
		toast({
			variant: "destructive",
			title: "Authentication error",
			description: errorMessage,
			duration: 4000,
		});
	};
}

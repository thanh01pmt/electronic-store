// File: context/auth-context.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import Loading from "@/app/loading";
import type { AuthContextProviderType, AuthContextType } from "@/types/context-types";
import { createClient } from "@/lib/utils/supabase-client";
import type { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthContextProviderType) => {
	const [user, setUser] = useState<User | null>(null);
	const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>(undefined);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const supabase = createClient();

	useEffect(() => {
		let isMounted = true;

		async function getInitialSession() {
			const { data: { session } } = await supabase.auth.getSession();
			if (isMounted) {
				setUser(session?.user ?? null);
				setIsSignedIn(!!session?.user);
				setIsLoaded(true);
			}
		}

		getInitialSession();

		// Subscribe to auth state updates (sign in, sign out, token refresh)
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			if (isMounted) {
				setUser(session?.user ?? null);
				setIsSignedIn(!!session?.user);
				setIsLoaded(true);
			}
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	return (
		<AuthContext.Provider value={{ isSignedIn, user, isLoaded }}>
			{isLoaded ? children : <Loading />}
		</AuthContext.Provider>
	);
};

import type { CurrencyType } from "@/types/currency-types";
import type { User } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction } from "react";

export type AuthContextType = {
	isSignedIn: boolean | undefined;
	isLoaded: boolean;
	user: User | undefined | null;
};

export type AuthContextProviderType = {
	children: React.ReactNode;
};

export type CurrencyContextType = {
	currency: CurrencyType;
	setCurrency: Dispatch<SetStateAction<CurrencyType>>;
};

export type CurrencyContextProviderType = {
	children: React.ReactNode;
};

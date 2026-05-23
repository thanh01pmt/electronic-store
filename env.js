import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
		STRIPE_SECRET_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_IP_INFO_API_KEY: z.string().min(1),
		NEXT_PUBLIC_APP_URL: z.string().min(1),
		NEXT_PUBLIC_UPDATES_EMAIL_ADDR: z.string().min(1),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,

		// supabase
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

		// email
		RESEND_API_KEY: process.env.RESEND_API_KEY,

		// payment gateway
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

		// ip info
		NEXT_PUBLIC_IP_INFO_API_KEY: process.env.NEXT_PUBLIC_IP_INFO_API_KEY,

		// app url
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

		// updates email
		NEXT_PUBLIC_UPDATES_EMAIL_ADDR: process.env.NEXT_PUBLIC_UPDATES_EMAIL_ADDR,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});

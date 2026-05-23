// File: components/auth/reset-password-form.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import { useHandleAuthError } from "@/components/auth/handle-auth-error";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { RESET_PASSWORD_STEP_2_PAGE } from "@/lib/constants/page-routes";
import { resetPasswordSchema } from "@/lib/schema/yup-schema";
import { createClient } from "@/lib/utils/supabase-client";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function ResetPasswordForm() {
	const router = useRouter();
	const supabase = createClient();
	const [isLoading, startTransition] = useTransition();
	const handleAuthError = useHandleAuthError();
	const { toast } = useToast();

	const initialValues = {
		email: "",
	};

	function handleOnSubmit(values: typeof initialValues) {
		startTransition(async () => {
			try {
				const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
					redirectTo: `${window.location.origin}/auth/reset-password-2`,
				});

				if (error) throw error;

				sessionStorage.setItem("reset_password_email", values.email);
				router.push(RESET_PASSWORD_STEP_2_PAGE);
				toast({
					variant: "default",
					title: "Check your email",
					description: "We sent you a password reset link/verification code.",
					duration: 4000,
				});
			} catch (err: unknown) {
				handleAuthError(err, "SEND RESET PASSWORD CODE FAULT");
			}
		});
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={resetPasswordSchema}
			onSubmit={handleOnSubmit}>
			{({}) => (
				<Form className="space-y-3">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Field
							as={Input}
							id="email"
							name="email"
							type="email"
							placeholder="name@domain.com"
							autoComplete="off"
							required
						/>
					</div>
					<ButtonWithSpinner
						isLoading={isLoading}
						label={"Send Verification Code"}
						type="submit"
						className="w-full"
					/>
				</Form>
			)}
		</Formik>
	);
}

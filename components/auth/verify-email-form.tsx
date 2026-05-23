// File: components/auth/verify-email-form.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import { useHandleAuthError } from "@/components/auth/handle-auth-error";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { HOME_PAGE, SIGNUP_NOTIFICATION_EMAIL_ENDPOINT } from "@/lib/constants/page-routes";
import { verifyEmailSchema } from "@/lib/schema/yup-schema";
import { captureUserSignupAction } from "@/lib/server-actions/cart-actions";
import { createClient } from "@/lib/utils/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONSOLE_RED_TEXT } from "@/lib/constants/app";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ClerkSignupDataType } from "@/types/clerk-types";

export function VerifyEmailForm() {
	const supabase = createClient();
	const router = useRouter();
	const [isLoading, startTransition] = useTransition();
	const handleAuthError = useHandleAuthError();

	const initialValues = {
		code: "",
	};

	async function handleOnSubmit(values: typeof initialValues) {
		startTransition(async () => {
			const email = sessionStorage.getItem("signup_email");
			if (!email) {
				handleAuthError(new Error("Email not found. Please sign up again."), "VERIFY EMAIL FAULT");
				return;
			}

			try {
				const { data, error } = await supabase.auth.verifyOtp({
					email,
					token: values.code,
					type: "signup",
				});

				if (error) throw error;
				if (!data.user) {
					throw new Error("Verification succeeded but no user was returned.");
				}

				const metadata = data.user.user_metadata as Record<string, string> | undefined;
				const signupData: ClerkSignupDataType = {
					firstName: metadata?.first_name ?? metadata?.firstName ?? "",
					lastName: metadata?.last_name ?? metadata?.lastName ?? "",
					email: data.user.email ?? "",
					userId: data.user.id,
				};

				// Send signup email notification
				const signupEmail = await fetch(SIGNUP_NOTIFICATION_EMAIL_ENDPOINT, {
					method: "POST",
					body: JSON.stringify(signupData),
				});

				if (!signupEmail.ok) {
					console.error(CONSOLE_RED_TEXT, `SIGNUP EMAIL FAULT => ${JSON.stringify(signupEmail, null, 2)}`);
				}

				try {
					await captureUserSignupAction(signupData);
				} catch (err) {
					handleAuthError(err, "SIGNUP ACTION FAULT");
					return;
				}

				router.push(HOME_PAGE);
				router.refresh();
			} catch (err: unknown) {
				handleAuthError(err, "VERIFY EMAIL FAULT");
			}
		});
	}

	async function handleResendBtnClick() {
		startTransition(async () => {
			const email = sessionStorage.getItem("signup_email");
			if (!email) {
				handleAuthError(new Error("Email not found. Please sign up again."), "RESEND CODE FAULT");
				return;
			}
			const { error } = await supabase.auth.resend({
				type: "signup",
				email,
			});
			if (error) {
				handleAuthError(error, "RESEND CODE FAULT");
			}
		});
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={verifyEmailSchema}
			onSubmit={handleOnSubmit}>
			{({}) => (
				<Form className="space-y-2">
					<div className="grid gap-2">
						<Field
							data-testid="verify-email-code-input"
							as={Input}
							id="code"
							name="code"
							type="text"
							autoComplete="off"
							formNoValidate
							required
							pattern="\d{6}"
							placeholder="6-digit verification code"
						/>
					</div>
					<ButtonWithSpinner
						data-testid="verify-email-submit-button"
						className="w-full"
						isLoading={isLoading}
						label={"Verify Email"}
						type="submit"
					/>
					<div className="mt-2">
						<span className="text-sm">Did&apos;t receive code?</span>
						<Button
							disabled={isLoading}
							onClick={() => handleResendBtnClick()}
							className="-ml-3"
							variant={"link"}>
							Resend
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

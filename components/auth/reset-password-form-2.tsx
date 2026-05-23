// File: components/auth/reset-password-form-2.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import { useHandleAuthError } from "@/components/auth/handle-auth-error";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword2Schema } from "@/lib/schema/yup-schema";
import { createClient } from "@/lib/utils/supabase-client";
import { Field, Form, Formik } from "formik";
import { useState, useTransition } from "react";

export function ResetPasswordForm2() {
	const supabase = createClient();
	const [isLoading, startTransition] = useTransition();
	const [isCompleted, setIsCompleted] = useState(false);
	const { toast } = useToast();
	const handleAuthError = useHandleAuthError();

	const initialValues = {
		code: "",
		newPassword: "",
	};

	function handleOnSubmit(values: typeof initialValues) {
		startTransition(async () => {
			try {
				const email = sessionStorage.getItem("reset_password_email");
				
				if (values.code && email) {
					// Verify OTP recovery token first if user provided a code
					const { error: verifyError } = await supabase.auth.verifyOtp({
						email,
						token: values.code,
						type: "recovery",
					});
					if (verifyError) throw verifyError;
				}

				// Update user password
				const { error: updateError } = await supabase.auth.updateUser({
					password: values.newPassword,
				});
				if (updateError) throw updateError;

				setIsCompleted(true);
				toast({
					variant: "default",
					title: "Password Reset Successful",
					description: "Your password has been reset successfully.",
				});
			} catch (err: unknown) {
				handleAuthError(err, "RESET PASSWORD CODE VALIDATION FAULT");
			}
		});
	}

	if (isCompleted) {
		return (
			<div>
				<p className="my-4">You successfully changed your password.</p>
			</div>
		);
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={resetPassword2Schema}
			onSubmit={handleOnSubmit}>
			{({}) => (
				<Form className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="code">Verification Code</Label>
						<Field
							as={Input}
							id="code"
							name="code"
							type="text"
							autoComplete="off"
							formNoValidate
							required
							placeholder="6-digit verification code"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="newPassword">New password</Label>
						<Field
							as={Input}
							id="newPassword"
							name="newPassword"
							type="password"
							autoComplete="off"
							formNoValidate
							required
							placeholder="enter your new password"
						/>
					</div>
					<ButtonWithSpinner
						isLoading={isLoading}
						label={"Reset Password"}
						type="submit"
						className="w-full"
					/>
				</Form>
			)}
		</Formik>
	);
}

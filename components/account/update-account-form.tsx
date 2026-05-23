// File: components/account/update-account-form.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import { CurrentPasswordInput, NewPasswordInput } from "@/components/account/account-input-fields";
import { ChangePasswordHeading } from "@/components/account/change-password-heading";
import { useHandleAuthError } from "@/components/auth/handle-auth-error";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { useToast } from "@/components/ui/use-toast";
import { updateAccountSchema } from "@/lib/schema/yup-schema";
import { createClient } from "@/lib/utils/supabase-client";
import { Form, Formik } from "formik";
import { useTransition } from "react";

export function ChangePasswordForm() {
	const supabase = createClient();
	const { toast } = useToast();
	const [isLoading, startTransition] = useTransition();
	const handleAuthError = useHandleAuthError();

	const initialValues = {
		currentPassword: "",
		newPassword: "",
	};

	function handleOnSubmit(values: typeof initialValues) {
		startTransition(async () => {
			const { newPassword, currentPassword } = values;

			if (!newPassword.trim() || !currentPassword.trim()) {
				toast({
					variant: "destructive",
					title: "Empty Password",
					description: "Please enter your password to change it.",
					duration: 4000,
				});
				return;
			}

			try {
				const { error } = await supabase.auth.updateUser({
					password: newPassword,
				});
				if (error) throw error;

				toast({
					title: "Password Changed",
					description: "Your password has been successfully updated.",
					duration: 4000,
				});
			} catch (err: unknown) {
				handleAuthError(err, "PASSWORD CHANGE FAULT");
			}
		});
	}

	return (
		<>
			<ChangePasswordHeading />
			<Formik
				initialValues={initialValues}
				validationSchema={updateAccountSchema}
				onSubmit={handleOnSubmit}>
				{({}) => (
					<Form className="w-full space-y-4">
						<CurrentPasswordInput />
						<NewPasswordInput />
						<ButtonWithSpinner
							isLoading={isLoading}
							label={"Change Password"}
							type="submit"
							className="w-full"
						/>
					</Form>
				)}
			</Formik>
		</>
	);
}

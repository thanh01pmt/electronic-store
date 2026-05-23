// File: components/auth/login-form.tsx
// Implements: specs/auth/spec.md
// Requirement: Auth Session Validation

"use client";
import { useHandleAuthError } from "@/components/auth/handle-auth-error";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShowPasswordButton } from "@/components/ui/show-password-button";
import { HOME_PAGE } from "@/lib/constants/page-routes";
import { loginSchema } from "@/lib/schema/yup-schema";
import { transferGuestCartToUserAction } from "@/lib/server-actions/cart-actions";
import { createClient } from "@/lib/utils/supabase-client";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
	const [isLoading, startTransition] = useTransition();
	const [isPasswordVisible, setIsShowPassword] = useState(false);
	const supabase = createClient();
	const router = useRouter();
	const handleAuthError = useHandleAuthError();

	const initialValues = {
		email: "",
		password: "",
	};

	function handleOnSubmit(loginCredentials: typeof initialValues) {
		startTransition(async () => {
			try {
				const { error } = await supabase.auth.signInWithPassword({
					email: loginCredentials.email,
					password: loginCredentials.password,
				});
				if (error) throw error;

				await transferGuestCartToUserAction();
				router.push(HOME_PAGE);
				router.refresh();
			} catch (err: unknown) {
				handleAuthError(err, "LOGIN FAULT");
			}
		});
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={loginSchema}
			onSubmit={handleOnSubmit}>
			{({}) => (
				<Form className="space-y-3">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Field
							data-testid="email-input"
							as={Input}
							id="email"
							name="email"
							type="email"
							placeholder="name@domain.com"
							autoComplete="off"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Field
								data-testid="password-input"
								as={Input}
								id="password"
								name="password"
								type={isPasswordVisible ? "text" : "password"}
								autoComplete="off"
								placeholder="enter your password"
								formNoValidate
								required
							/>
							<ShowPasswordButton
								isPasswordVisible={isPasswordVisible}
								setIsPasswordVisible={setIsShowPassword}
							/>
						</div>
					</div>
					<ButtonWithSpinner
						data-testid="sign-in-button"
						isLoading={isLoading}
						label={"Sign In"}
						type="submit"
						className="w-full"
					/>
				</Form>
			)}
		</Formik>
	);
}

import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { login } from "~/utils/supabase/auth_service/login";
import { z } from "zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { loginSchema } from "~/schemas/auth/login";

export default function Login() {
	const navigation = useNavigation();
	const actionData = useActionData<typeof action>();

	return (
		<div className="flex h-screen w-screen items-center justify-center max-w-5xl mx-auto px-4">
			<Form method="post" className="w-full">
				<Card className="max-w-5xl w-full">
					<CardHeader>
						<CardTitle>Login</CardTitle>
					</CardHeader>
					<CardContent className="w-full space-y-4">
						<div className="flex flex-col gap-2 w-full">
							<Label>Email</Label>
							<Input type="email" name="email" />
							{actionData?.errors?.type === "validation" &&
								actionData.errors.email && (
									<p className="text-sm text-destructive">
										{actionData.errors.email[0]}
									</p>
								)}
						</div>
						<div className="flex flex-col gap-2 w-full">
							<Label>Password</Label>
							<Input type="password" name="password" />
							{actionData?.errors?.type === "validation" &&
								actionData.errors.password && (
									<p className="text-sm text-destructive">
										{actionData.errors.password[0]}
									</p>
								)}
						</div>
						{actionData?.errors?.type === "form" && (
							<p className="text-sm text-destructive">
								{actionData.errors.form[0]}
							</p>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="link" asChild>
							<Link to="/signup">Sign up</Link>
						</Button>
						<Button type="submit" disabled={navigation.state === "submitting"}>
							{navigation.state === "submitting" ? "Logging in..." : "Login"}
						</Button>
					</CardFooter>
				</Card>
			</Form>
		</div>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = Object.fromEntries(await request.formData());
	const result = loginSchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: {
				type: "validation" as const,
				...result.error.flatten().fieldErrors,
			},
		};
	}

	const { email, password } = result.data;

	try {
		const { headers, redirectTo } = await login(request, email, password);
		return redirect(redirectTo, { headers });
	} catch (error: unknown) {
		console.error(error);
		const errorMessage =
			error instanceof Error ? error.message : "Wrong email or password";
		return {
			errors: {
				type: "form" as const,
				form: [errorMessage],
			},
		};
	}
}

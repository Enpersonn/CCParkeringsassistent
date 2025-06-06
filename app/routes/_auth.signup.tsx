import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useNavigation, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { signup } from "~/utils/supabase/auth_service/signup";
import { Label } from "~/components/ui/label";
import { signupSchema } from "~/schemas/auth/signup";

type ActionData = {
	errors:
		| {
				type: "validation";
				email?: string[];
				password?: string[];
				confirmPassword?: string[];
		  }
		| {
				type: "form";
				form: string[];
		  };
};

export default function Signup() {
	const actionData = useActionData<ActionData>();
	const navigation = useNavigation();

	return (
		<div className="flex h-screen w-screen items-center justify-center max-w-5xl mx-auto px-4">
			<Form method="post" className="w-full">
				<Card className=" w-full space-y-4">
					<CardHeader>
						<CardTitle>Sign Up</CardTitle>
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
						<div className="flex gap-2 w-full">
							<div className="flex flex-col gap-2 w-full">
								<Label className="w-full">Password</Label>
								<Input type="password" name="password" />
								{actionData?.errors?.type === "validation" &&
									actionData.errors.password && (
										<p className="text-sm text-destructive">
											{actionData.errors.password[0]}
										</p>
									)}
							</div>
							<div className="flex flex-col gap-2 w-full">
								<Label className="w-full">Confirm Password</Label>
								<Input type="password" name="confirmPassword" />
								{actionData?.errors?.type === "validation" &&
									actionData.errors.confirmPassword && (
										<p className="text-sm text-destructive">
											{actionData.errors.confirmPassword[0]}
										</p>
									)}
							</div>
						</div>
						{actionData?.errors?.type === "form" && (
							<p className="text-sm text-destructive">
								{actionData.errors.form[0]}
							</p>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="link" asChild>
							<Link to="/login">Login</Link>
						</Button>
						<Button type="submit" disabled={navigation.state === "submitting"}>
							{navigation.state === "submitting" ? "Signing up..." : "Sign up"}
						</Button>
					</CardFooter>
				</Card>
			</Form>
		</div>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = Object.fromEntries(await request.formData());
	const result = signupSchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: {
				type: "validation" as const,
				...result.error.flatten().fieldErrors,
			},
		};
	}

	const { email, password, confirmPassword } = result.data;

	try {
		return await signup(request, email, password, confirmPassword);
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to sign up";
		return {
			errors: {
				type: "form" as const,
				form: [errorMessage],
			},
		};
	}
}

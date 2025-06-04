import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { signup } from "~/utils/supabase/auth_service/signup";

export default function Signup() {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<Form method="post">
				<label htmlFor="email">
					Email
					<input type="email" name="email" />
				</label>
				<label htmlFor="password">
					Password
					<input type="password" name="password" />
				</label>
				<label htmlFor="confirmPassword">
					Confirm Password
					<input type="password" name="confirmPassword" />
				</label>
				<button type="submit">Sign up</button>
			</Form>
		</div>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = formData.get("email")?.toString() ?? "";
	const password = formData.get("password")?.toString() ?? "";
	const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

	if (password !== confirmPassword) {
		return new Response(JSON.stringify({ error: "Passwords do not match" }), {
			status: 400,
		});
	}
	try {
		const response = await signup(request, email, password, confirmPassword);
		return response;
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to sign up" }), {
			status: 400,
		});
	}
}

import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { signupSchema } from "~/schemas/auth/signup";
import { signup } from "~/utils/supabase/auth_service/signup";

export async function action({ request }: ActionFunctionArgs) {
	const url = new URL(request.url);
	const origin = url.origin;

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
		const { success, headers } = await signup(
			request,
			email,
			password,
			confirmPassword,
			origin,
		);
		if (success) return redirect("/check_email", { headers });
		return {
			errors: {
				type: "form" as const,
				form: ["Failed to sign up"],
			},
		};
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

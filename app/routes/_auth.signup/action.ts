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

	const { success, error } = await signup(
		request,
		email,
		password,
		confirmPassword,
		origin,
	);

	if (success) return redirect("/check_email");

	return {
		errors: {
			type: "form" as const,
			form: [error || "Failed to sign up"],
		},
	};
}

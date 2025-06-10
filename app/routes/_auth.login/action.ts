import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { loginSchema } from "~/schemas/auth/login";
import { login } from "~/utils/supabase/auth_service/login";

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
			error instanceof Error ? error.message : "Feil e-post eller passord";
		return {
			errors: {
				type: "form" as const,
				form: [errorMessage],
			},
		};
	}
}

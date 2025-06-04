import { redirect } from "@remix-run/react";
import { getSupabaseServerClient } from "../supabase.server";
export async function signup(
	request: Request,
	email: string,
	password: string,
	confirmPassword: string,
) {
	if (password !== confirmPassword) {
		throw new Response(JSON.stringify({ error: "Passwords do not match" }), {
			status: 400,
		});
	}

	const { supabase, headers } = getSupabaseServerClient(request);

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${process.env.APP_URL}/auth/callback`,
		},
	});

	if (error) {
		throw new Response(JSON.stringify({ error: error.message }), {
			status: 400,
		});
	}

	return redirect("/check_email", { headers });
}

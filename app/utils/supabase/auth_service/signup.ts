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

	const { data: authData, error: authError } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${process.env.APP_URL}/auth/callback`,
		},
	});

	if (authError) {
		throw new Response(JSON.stringify({ error: authError.message }), {
			status: 400,
		});
	}

	const userId = authData.user?.id;

	if (!userId) {
		throw new Response(
			JSON.stringify({ error: "User ID missing after sign up" }),
			{
				status: 500,
			},
		);
	}

	const { error: profileError } = await supabase
		.from("profiles")
		.insert([{ id: userId, is_verified: false }]);

	if (profileError) {
		throw new Response(
			JSON.stringify({ error: "Failed to create user profile" }),
			{
				status: 500,
			},
		);
	}

	return redirect("/check_email", { headers });
}

import { redirect } from "@remix-run/react";
import { getSupabaseServerClient } from "../supabase.server";
import { invalidateCacheByPrefix } from "~/utils/cache.server";
export async function signup(
	request: Request,
	email: string,
	password: string,
	confirmPassword: string,
	origin?: string,
) {
	if (password !== confirmPassword) {
		throw new Response(JSON.stringify({ error: "Passwords do not match" }), {
			status: 400,
		});
	}

	const { supabase, headers } = getSupabaseServerClient(request);

	const { error: authError } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
		},
	});

	if (authError) {
		throw new Response(JSON.stringify({ error: authError.message }), {
			status: 400,
		});
	}

	invalidateCacheByPrefix("admin-users-list");

	return redirect("/check_email", { headers });
}

import { getSupabaseServerClient } from "../supabase.server";

export async function login(request: Request, email: string, password: string) {
	const { supabase, headers } = getSupabaseServerClient(request);

	const { data: authData, error: authError } =
		await supabase.auth.signInWithPassword({
			email,
			password,
		});

	if (authError) {
		throw new Error(authError.message);
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("is_verified")
		.eq("id", authData.user?.id)
		.single();

	if (profileError) {
		throw new Error(profileError.message);
	}

	return {
		headers,
		isVerified: profile.is_verified,
		redirectTo: profile.is_verified ? "/" : "/auth/callback",
	};
}

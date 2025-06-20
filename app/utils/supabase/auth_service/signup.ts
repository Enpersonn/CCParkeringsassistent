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
		return { error: "Passwords do not match" };
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
		return { error: authError.message };
	}

	invalidateCacheByPrefix("admin-users-list");
	return { success: true, headers };
}

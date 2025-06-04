import {
	createServerClient,
	parseCookieHeader,
	serializeCookieHeader,
} from "@supabase/ssr";
export function getSupabaseServerClient(request: Request) {
	const cookies = request.headers.get("Cookie") ?? "";
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Missing Supabase environment variables");
	}

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			async getAll() {
				const parsed = parseCookieHeader(cookies);
				return parsed.map((cookie) => ({
					name: cookie.name,
					value: cookie.value ?? "",
				}));
			},
			setAll(cookiesToSet) {
				for (const { name, value, options } of cookiesToSet) {
					request.headers.append(
						"Set-Cookie",
						serializeCookieHeader(name, value, options),
					);
				}
			},
		},
	});

	return { supabase, headers: request.headers };
}

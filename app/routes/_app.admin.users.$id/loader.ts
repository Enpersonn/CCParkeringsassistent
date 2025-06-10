import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const { id } = params;
	if (!id) throw new Error("User ID is required");

	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const personalUserId = sessionData.session?.user.id;
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", id)
		.single();

	if (profileError)
		throw new Error(`Failed to fetch profile: ${profileError.message}`);

	const { data: userData, error: userError } = await supabase.functions.invoke(
		"get-user",
		{
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"x-api-key": process.env.ADMIN_API_KEY as string,
			},
			body: {
				access_token: session.access_token,
				user_id: id,
				email: profile?.email,
			},
		},
	);

	if (userError) throw new Error(`Failed to fetch user: ${userError.message}`);

	const user = userData.user;

	const data = {
		id: user.id,
		email: user.email,
		is_admin: user?.app_metadata?.role === "admin",
		is_verified: profile?.is_verified,
		personal_user_id: personalUserId,
	};

	return { data };
};

import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import { getCachedData, generateCacheKey } from "~/utils/cache.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	const response = await getCachedData(
		{
			key: generateCacheKey("admin-users-list", { userId: session.user.id }),
			ttl: 1000 * 60 * 5,
		},
		async () => {
			const edgeRes = await supabase.functions.invoke("list-users", {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
					"x-api-key": process.env.ADMIN_API_KEY as string,
				},
				body: {
					access_token: session.access_token,
				},
			});

			const { data: profileData } = await supabase.from("profiles").select("*");

			const users = edgeRes.data.users.map(
				(user: {
					id: string;
					email: string;
					app_metadata: { role: string };
				}) => {
					const profile = profileData?.find((p) => p.id === user.id);
					return {
						id: user.id,
						email: user.email,
						is_admin: user?.app_metadata?.role === "admin",
						is_verified: profile?.is_verified,
					};
				},
			);

			if (!edgeRes.data) throw new Error("Failed to fetch users");
			return users;
		},
	);

	return { data: response };
};

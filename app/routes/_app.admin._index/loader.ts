import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import { generateCacheKey, getCachedData } from "~/utils/cache.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = await getSupabaseServerClient(request);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const data = await getCachedData(
		{
			key: generateCacheKey("admin-dashboard", {
				userId: session?.user.id || "anonymous",
			}),
			ttl: 1000 * 60 * 2,
		},
		async () => {
			const { data, error } = await supabase.functions.invoke("super-handler", {
				headers: {
					authorization: `Bearer ${session?.access_token}`,
					"x-api-key": process.env.ADMIN_API_KEY || "",
				},
			});

			if (error) throw new Error(error.message);
			return data;
		},
	);

	const res = [
		{
			title: "Brukere",
			valueTitle: "Total brukere",
			value: data.totalUsers,
			link: "/admin/users",
		},
		{
			title: "Parkeringsplasser",
			valueTitle: "Total parkeringsplasser",
			value: data.parkingSpots,
			link: "/admin/parking-spots",
		},
		{
			title: "Parkeringer",
			valueTitle: "Total aktive parkeringer",
			value: data.activeParkingRequests,
			link: "/admin/parking-request",
		},
		{
			title: "Lokasjoner",
			valueTitle: "Antall lokasjoner",
			value: data.locations,
			link: "/admin/parking-locations",
		},
	];

	return { data: res };
};

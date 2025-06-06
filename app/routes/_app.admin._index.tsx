import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import StatsCard from "~/components/admin/dashboard/stats-card";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import { getCachedData, generateCacheKey } from "~/utils/cache.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = await getSupabaseServerClient(request);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Use caching for dashboard data
	const data = await getCachedData(
		{
			key: generateCacheKey("admin-dashboard", {
				userId: session?.user.id || "anonymous",
			}),
			ttl: 1000 * 60 * 2, // Cache for 2 minutes
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

	return { data };
};

export default function AdminIndex() {
	const { data } = useLoaderData<typeof loader>();
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<StatsCard
				title="Brukere"
				valueTitle="Total brukere"
				value={data.totalUsers}
				link="/admin/users"
			/>
			<StatsCard
				title="Gjester"
				valueTitle="Aktive gjester"
				value={data.activeGuests}
				link="/admin/guests"
			/>
			<StatsCard
				title="Parkeringsplasser"
				valueTitle="Total parkeringsplasser"
				value={data.parkingSpots}
				link="/admin/parking-spots"
			/>
			<StatsCard
				title="Parkeringer"
				valueTitle="Total aktive parkeringer"
				value={data.activeParkingRequests}
				link="/admin/parking-request"
			/>
			<div className="col-span-1 md:col-span-2">
				<StatsCard
					title="Lokasjoner"
					valueTitle="Antall lokasjoner"
					value={data.locations}
					link="/admin/parking-locations"
				/>
			</div>
		</div>
	);
}

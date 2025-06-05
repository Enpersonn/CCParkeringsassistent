import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import StatsCard from "~/components/admin/dashboard/stats-card";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = await getSupabaseServerClient(request);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data, error } = await supabase.functions.invoke("super-handler", {
		headers: {
			authorization: `Bearer ${session?.access_token}`,
			"x-api-key": process.env.ADMIN_API_KEY || "",
		},
	});

	if (error) throw new Error(error.message);

	return { data };
};

export default function AdminIndex() {
	const { data } = useLoaderData<typeof loader>();
	return (
		<div className="grid grid-cols-2 gap-4">
			<StatsCard
				title="Users"
				valueTitle="Total Users"
				value={data.totalUsers}
				link="/admin/users"
			/>
			<StatsCard
				title="Parking Spots"
				valueTitle="Total Parking Spots"
				value={data.parkingSpots}
				link="/admin/parking-spots"
			/>
			<StatsCard
				title="Parking Requests"
				valueTitle="Total Active Parkings"
				value={data.activeParkingRequests}
				link="/admin/parking-request"
			/>
			<StatsCard
				title="Guests"
				valueTitle="Total Active Guests"
				value={data.activeGuests}
				link="/admin/guests"
			/>
		</div>
	);
}

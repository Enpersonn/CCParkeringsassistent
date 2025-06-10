import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import { generateCacheKey, getCachedData } from "~/utils/cache.server";
import type { ParkingLocation } from "~/types/app/parking-location";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) return redirect("/login");

	const { data: activeUserParking } = await supabase
		.from("parking_requests")
		.select("*")
		.eq("user_id", session.user.id)
		.eq("is_active", true)
		.single();

	if (activeUserParking) return redirect("/active-parking");

	const data = await getCachedData(
		{
			key: generateCacheKey("parking-locations-list", {
				userId: session?.user.id || "anonymous",
			}),
			ttl: 1000 * 60 * 2,
		},
		async () => {
			const { data, error } = await supabase.functions.invoke(
				"retrive_parking_options",
				{
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				},
			);

			if (error) throw new Error(error.message);
			const filteredData = data.filter(
				(location: ParkingLocation) => location.parking_spots.length > 0,
			);

			return filteredData;
		},
	);

	return { parkingLocations: data as ParkingLocation[] };
};

import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { generateCacheKey, getCachedData } from "~/utils/cache.server";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError || !userData?.user) return redirect("/login");

	const user = userData.user;

	const { data: parkingRequest } = await supabase
		.from("parking_requests")
		.select("*")
		.eq("user_id", user.id)
		.eq("is_active", true)
		.single();

	if (
		parkingRequest.expires_at &&
		new Date(parkingRequest.expires_at) < new Date()
	) {
		await supabase
			.from("parking_requests")
			.update({ is_active: false, disabled_at: new Date() })
			.eq("id", parkingRequest.id);
		return redirect("/");
	}

	if (!parkingRequest) return redirect("/");

	const parkingSpotData = await getCachedData(
		{
			key: generateCacheKey("parking-spot-session", {
				requestId: parkingRequest.id,
			}),
			ttl: 1000 * 60 * 10,
		},
		async () => {
			const { data, error } = await supabase
				.from("parking_spots")
				.select("*")
				.eq("id", parkingRequest.parking_spot)
				.single();

			if (error) throw new Error(error.message);
			return data;
		},
	);

	const parkingLocationData = await getCachedData(
		{
			key: generateCacheKey("parking-location", {
				name: parkingSpotData.location,
			}),
			ttl: 1000 * 60 * 10,
		},
		async () => {
			const { data, error } = await supabase
				.from("parking_locations")
				.select("*")
				.eq("Name", parkingSpotData.location)
				.single();

			if (error) throw new Error(error.message);
			return data;
		},
	);

	return {
		id: parkingRequest.id,
		expires_at: parkingRequest.expires_at,
		location_name: parkingLocationData.Name,
		created_at: parkingRequest.created_at,
	};
};

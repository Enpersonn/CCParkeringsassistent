import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import reserveParkingSpot from "~/lib/parking/reserve.server";
import { invalidateCacheByPrefix } from "~/utils/cache.server";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);

	const RETRY_LIMIT = 3;
	const formData = await request.formData();
	const locationName = formData.get("locationName");
	const userId = formData.get("userId");

	if (typeof locationName !== "string" || typeof userId !== "string")
		return { error: "Missing or invalid form fields" };

	const { data: parkingSpots, error: spotsError } = await supabase
		.from("parking_spots")
		.select("*")
		.eq("location", locationName);

	if (spotsError) return { error: spotsError.message };
	if (!parkingSpots?.length) return { error: "No parking spots found" };

	for (let i = 0; i < RETRY_LIMIT; i++) {
		const result = await reserveParkingSpot({
			supabase,
			userId,
			parkingSpots,
		});

		if (result && "success" in result) {
			invalidateCacheByPrefix("parking-locations");
			return redirect("/active-parking");
		}
		if (result && "error" in result) return { error: result.error };
	}

	return { error: "Failed to reserve parking spot" };
};

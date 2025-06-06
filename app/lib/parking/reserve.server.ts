import type { SupabaseClient } from "@supabase/supabase-js";
import getExpiryTime from "~/utils/get-expiry-time";
import type { ParkingSpot } from "~/types/app/parking-spot";

async function reserveParkingSpot({
	supabase,
	userId,
	parkingSpots,
}: {
	supabase: SupabaseClient;
	userId: string;
	parkingSpots: ParkingSpot[];
}): Promise<{ success: true } | { error?: string } | null> {
	const { data: activeRequests, error: requestError } = await supabase
		.from("parking_requests")
		.select("parking_spot")
		.in(
			"parking_spot",
			parkingSpots.map((s) => s.id),
		)
		.eq("is_active", true);

	if (requestError) return { error: requestError.message };

	const unavailableIds = new Set(activeRequests?.map((r) => r.parking_spot));
	const availableSpot = parkingSpots.find((s) => !unavailableIds.has(s.id));

	if (!availableSpot) return { error: "No available parking spots" };

	const expires = getExpiryTime();

	const { error: insertError } = await supabase
		.from("parking_requests")
		.insert([
			{
				user_id: userId,
				parking_spot: availableSpot.id,
				is_active: true,
				created_at: new Date(),
				expires_at: expires,
			},
		])
		.select()
		.single();

	if (insertError?.code === "23505") return null;
	if (insertError) return { error: insertError.message };

	return { success: true };
}

export default reserveParkingSpot;

import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ParkingLocation } from "~/types/app/parking-location";
import type { ParkingSpot } from "~/types/app/parking-spot";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data, error } = await supabase.from("parking_spots").select("*");

	const { data: locations } = await supabase
		.from("parking_locations")
		.select("*");

	if (error) throw new Error(error.message);

	return {
		data: data as ParkingSpot[],
		locations: locations as ParkingLocation[],
	};
};

import type { ActionFunctionArgs } from "@remix-run/node";
import { newParkingSpotSchema } from "~/schemas/parking-spot/new";

import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();

	const validatedData = newParkingSpotSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!validatedData.success) return { error: validatedData.error.message };

	const { error } = await supabase.from("parking_spots").insert({
		Name: validatedData.data.name,
		location: validatedData.data.location,
		max_vehicel_height: validatedData.data.max_vehicel_height,
		max_vehicel_width: validatedData.data.max_vehicel_width,
		max_vehicel_length: validatedData.data.max_vehicel_length,
	});

	if (error) return { error: error.message };

	return { success: true };
}

import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { newParkingSpotSchema } from "~/schemas/parking-spot/new";

import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();

	const validatedData = newParkingSpotSchema.safeParse(formData);

	if (!validatedData.success) throw new Error(validatedData.error.message);

	const { data, error } = await supabase.from("parking_spots").insert({
		...validatedData.data,
	});

	if (error) throw new Error(error.message);

	return redirect("/admin/parking-spots");
}

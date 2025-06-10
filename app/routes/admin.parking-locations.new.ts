import type { ActionFunctionArgs } from "@remix-run/node";
import { newParkingLocationSchema } from "~/schemas/parking-location/new";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();

	const {
		success,
		data: validatedData,
		error: validationError,
	} = newParkingLocationSchema.safeParse({
		name: formData.get("name"),
		is_indoors: formData.get("is_indoors") === "true",
	});

	if (!success) return { error: validationError.message };

	const { data, error } = await supabase.from("parking_locations").insert({
		Name: validatedData.name,
		is_indoors: validatedData.is_indoors,
	});
	if (error) return { error: error.message };

	return { success: true };
}

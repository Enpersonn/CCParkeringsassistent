import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { id } = params;

	const { data, error } = await supabase
		.from("parking_spots")
		.select("*")
		.eq("id", id)
		.single();

	if (error) throw new Error(error.message);

	const returnData = {
		id: data.id,
		Name: data.Name,
		location: data.location,
		mesurments: [
			{
				value: data.Max_vehicel_height,
				name: "Høyde",
			},
			{
				value: data.Max_vehicel_width,
				name: "Bredde",
			},
			{
				value: data.Max_vehicel_length,
				name: "Lengde",
			},
		],
	};

	return { data: returnData };
};

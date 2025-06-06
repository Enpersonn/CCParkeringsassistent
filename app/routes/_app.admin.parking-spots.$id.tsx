import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ParkingSpot } from "~/types/app/parking-spot";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { id } = await params;

	const { data, error } = await supabase
		.from("parking_spots")
		.select("*")
		.eq("id", id)
		.single();

	if (error) throw new Error(error.message);

	const returnData: ParkingSpot = {
		id: data.id,
		Name: data.Name,
		location: data.location,
		Max_vehicel_height: data.Max_vehicel_height,
		Max_vehicel_width: data.Max_vehicel_width,
		Max_vehicel_length: data.Max_vehicel_length,
	};

	return { data: returnData };
};
export default function AdminParkingSpot() {
	const { data } = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-col gap-4">
			<h1>{data.Name}</h1>
			<p>{data.location}</p>
			<p>{data.Max_vehicel_height}</p>
			<p>{data.Max_vehicel_width}</p>
			<p>{data.Max_vehicel_length}</p>
		</div>
	);
}

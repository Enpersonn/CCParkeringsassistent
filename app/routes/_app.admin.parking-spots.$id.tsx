import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DeleteParkingSpotDialog from "~/components/admin/parking-spot/delete-parking-spot-dialog";
import { Badge } from "~/components/ui/badge";
import type { ParkingSpot } from "~/types/app/parking-spot";
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
			<header className="flex flex-row justify-between items-center">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-bold">{data.Name}</h1>
					<div className="flex flex-row gap-2">
						<Badge>{data.location}</Badge>
						{data.Max_vehicel_height && (
							<Badge variant="outline">
								Max Høyde: {data.Max_vehicel_height}
							</Badge>
						)}
						{data.Max_vehicel_width && (
							<Badge variant="outline">
								Max Bredde: {data.Max_vehicel_width}
							</Badge>
						)}
						{data.Max_vehicel_length && (
							<Badge variant="outline">
								Max Lengde: {data.Max_vehicel_length}
							</Badge>
						)}
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<DeleteParkingSpotDialog id={data.id} />
				</div>
			</header>
		</div>
	);
}

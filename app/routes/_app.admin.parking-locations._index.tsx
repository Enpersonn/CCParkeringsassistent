import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import DeleteParkingLocationDialog from "~/components/admin/parking-location/delete-parking-location-dialog";
import BasicTable from "~/components/general/table/basic-table";
import { Button } from "~/components/ui/button";
import type { ParkingLocation } from "~/types/app/parking-location";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data, error } = await supabase.from("parking_locations").select("*");
	if (error) throw new Error(error.message);
	return { data };
};
export default function AdminParkingLocations() {
	const { data } = useLoaderData<typeof loader>();

	const [_, setName] = useQueryState<string>("Name", {
		parse: (value) => value || "",
		serialize: (value) => value,
	});
	const columnHelper = createColumnHelper<ParkingLocation>();
	const columns = [
		columnHelper.accessor("created_at", {
			header: "Opprettet",
			cell: ({ getValue }) => {
				return <div>{new Date(getValue()).toLocaleString()}</div>;
			},
		}),
		columnHelper.accessor("Name", {
			header: "Name",
		}),
		columnHelper.accessor("Name", {
			header: " ",
			id: "delete-location",
			cell: ({ getValue }) => {
				return (
					<div className="flex flex-row gap-2 justify-end">
						<Button
							variant="destructive"
							onClick={() => {
								setName(getValue());
							}}
						>
							<TrashIcon className="size-4" />
						</Button>
					</div>
				);
			},
		}),
	];

	const tableInstance = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex flex-col gap-4">
			<DeleteParkingLocationDialog />
			<h1 className="text-2xl font-bold">Parking Locations</h1>
			<BasicTable table={tableInstance} />
		</div>
	);
}

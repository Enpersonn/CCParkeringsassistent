import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import BasicTable from "~/components/general/table/basic-table";
import { Button } from "~/components/ui/button";
import type { ParkingSpot } from "~/types/app/parking-spot";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data, error } = await supabase.from("parking_spots").select("*");

	if (error) throw new Error(error.message);

	return { data: data as ParkingSpot[] };
};

export default function AdminParkingSpots() {
	const { data } = useLoaderData<typeof loader>();

	const columnHelper = createColumnHelper<ParkingSpot>();

	const columns = [
		columnHelper.accessor("Name", {
			header: "Name",
		}),
		columnHelper.accessor("location", {
			header: "Location",
		}),
		columnHelper.accessor("id", {
			header: "View",
			cell: ({ getValue }) => {
				return (
					<Button asChild variant="ghost" size="icon">
						<Link to={`/admin/parking-spots/${getValue()}`}>
							<EyeIcon className="size-4" />
						</Link>
					</Button>
				);
			},
		}),
	];

	const tableInstance = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<BasicTable table={tableInstance} />
		</div>
	);
}

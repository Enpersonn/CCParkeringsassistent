import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import NewParkingSpotDialog from "~/components/admin/parking-spot/new-parking-spot-dialog";
import BasicTable from "~/components/general/table/basic-table";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
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

export default function AdminParkingSpots() {
	const { data, locations } = useLoaderData<typeof loader>();
	const [selectedLocation, setSelectedLocation] = useState<string>("all");
	const columnHelper = createColumnHelper<ParkingSpot>();

	const [filteredData, setFilteredData] = useState<ParkingSpot[]>(data);

	useEffect(() => {
		if (selectedLocation === "all") {
			setFilteredData(data);
		} else {
			setFilteredData(
				data.filter((spot) => spot.location === selectedLocation),
			);
		}
	}, [selectedLocation, data]);

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
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<header className="flex flex-row justify-between items-center">
				<h1 className="text-2xl font-bold">Parkeringsplasser</h1>
				<div className="flex flex-row gap-2 w-full justify-end items-center">
					<Select value={selectedLocation} onValueChange={setSelectedLocation}>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Velg lokasjon" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Alle</SelectItem>
							{locations.map((item) => (
								<SelectItem key={item.Name} value={item.Name}>
									{item.Name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<NewParkingSpotDialog locations={locations} />
				</div>
			</header>
			<BasicTable table={tableInstance} />
		</div>
	);
}

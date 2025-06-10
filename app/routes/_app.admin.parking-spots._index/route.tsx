import { useLoaderData } from "@remix-run/react";
import { useQueryState } from "nuqs";
import NewParkingSpotDialog from "~/components/admin/parking-spot/new-parking-spot-dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { loader as loaderFn } from "./loader";
import ParkingSpotsTable from "./table";

export { loader } from "./loader";

export default function AdminParkingSpots() {
	const { locations } = useLoaderData<typeof loaderFn>();
	const [selectedLocation, setSelectedLocation] = useQueryState<string>(
		"location",
		{
			parse: (value) => value || "all",
			serialize: (value) => value,
		},
	);

	return (
		<div>
			<header className="flex flex-col md:flex-row gap-4  justify-between items-center">
				<h1 className="text-2xl font-bold">Parkeringsplasser</h1>
				<div className="flex flex-row gap-2 w-full justify-end items-center">
					<Select
						value={selectedLocation || "all"}
						onValueChange={setSelectedLocation}
					>
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
			<ParkingSpotsTable />
		</div>
	);
}

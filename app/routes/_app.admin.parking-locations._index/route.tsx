import DeleteParkingLocationDialog from "~/components/admin/parking-location/delete-parking-location-dialog";
import NewParkingLocationDialog from "~/components/admin/parking-location/new-parking-location-dialog";
import ParkingLocationsTable from "./table";

export { loader } from "./loader";

export default function AdminParkingLocations() {
	return (
		<div className="flex flex-col gap-4">
			<DeleteParkingLocationDialog />
			<header className="flex flex-col md:flex-row gap-4 justify-between items-center">
				<h1 className="text-2xl font-bold">Parkeringslokasjoner</h1>
				<div className="w-full md:w-auto flex justify-end">
					<NewParkingLocationDialog />
				</div>
			</header>
			<ParkingLocationsTable />
		</div>
	);
}

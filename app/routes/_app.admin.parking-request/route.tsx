import ParkingRequestTable from "./table";

export { loader } from "./loader";

export default function AdminParkingRequest() {
	return (
		<div className="flex flex-col gap-4">
			<ParkingRequestTable />
		</div>
	);
}

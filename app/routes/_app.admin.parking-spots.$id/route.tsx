import { useLoaderData } from "@remix-run/react";
import DeleteParkingSpotDialog from "~/components/admin/parking-spot/delete-parking-spot-dialog";
import { Badge } from "~/components/ui/badge";
import type { loader as loaderFn } from "./loader";

export { loader } from "./loader";

export default function AdminParkingSpot() {
	const { data } = useLoaderData<typeof loaderFn>();
	return (
		<div className="flex flex-col gap-4">
			<header className="flex flex-row justify-between items-center">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-bold">{data.Name}</h1>
					<div className="flex flex-row gap-2">
						<Badge>{data.location}</Badge>
						{data.mesurments.length > 0 && (
							<div className="flex flex-row gap-2">
								{data.mesurments.map(({ name, value }) => {
									if (!value) return null;
									return (
										<Badge key={name} variant="outline">
											{name}: {value}
										</Badge>
									);
								})}
							</div>
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

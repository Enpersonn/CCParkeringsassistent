import { useNavigation, useOutletContext } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react/dist/components";
import ParkingLocationCard from "~/components/app/parking-location-card";
import ProfileSettingsDialog from "~/components/app/profile-settings-dialog";
import AdminButton from "~/components/general/admin-button";
import type { User } from "~/types/app/user";
import type { loader as loaderFn } from "./loader";

export { action } from "./action";
export { loader } from "./loader";

export default function Index() {
	const { parkingLocations } = useLoaderData<typeof loaderFn>();
	const { user } = useOutletContext<{ user: User }>();
	const navigation = useNavigation();

	return (
		<>
			<div className="flex flex-col gap-5 h-screen w-screen items-start pt-10 justify-start max-w-xl mx-auto px-4 relative">
				<AdminButton isAdmin={user.is_admin} />
				<ProfileSettingsDialog />
				<div className="flex flex-col items-center gap-10 w-full">
					<div className="flex flex-col items-center gap-4">
						<h1 className="text-xl font-bold">Velkommen {user.email}</h1>
						<p className="text-sm text-muted-foreground">
							Trykk på lokasjonen du står parkert på.
						</p>
					</div>
					<div className="flex flex-col gap-4 w-full">
						{parkingLocations.map((location) => {
							const isDisabled =
								location.active_parking_spots >=
									location.parking_spots.length || navigation.state !== "idle";
							return (
								<Form method="post" key={location.Name}>
									<input
										type="hidden"
										name="locationName"
										value={location.Name}
									/>
									<input type="hidden" name="userId" value={user.id} />
									<ParkingLocationCard
										data={{
											isDisabled,
											isIndoors: location.is_indoors || false,
											name: location.Name,
											activeParkingSpots: location.active_parking_spots,
											parkingSpots: location.parking_spots.length,
										}}
									/>
								</Form>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}

import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { useNavigate, useNavigation, useOutletContext } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react/dist/components";
import ParkingLocationCard from "~/components/app/parking-location-card";
import ProfileSettingsDialog from "~/components/app/profile-settings-dialog";
import AdminButton from "~/components/general/admin-button";
import reserveParkingSpot from "~/lib/parking/reserve.server";
import type { ParkingLocation } from "~/types/app/parking-location";
import type { User } from "~/types/app/user";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) return redirect("/login");

	const { data: activeUserParking } = await supabase
		.from("parking_requests")
		.select("*")
		.eq("user_id", session.user.id)
		.eq("is_active", true)
		.single();

	if (activeUserParking) return redirect("/active-parking");

	const { data: parkingLocations } = await supabase.functions.invoke(
		"retrive_parking_options",
		{
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		},
	);

	const parsedParkingLocations = parkingLocations.filter(
		(location: ParkingLocation) => location.parking_spots.length > 0,
	);

	return { parkingLocations: parsedParkingLocations as ParkingLocation[] };
};

export default function Index() {
	const { parkingLocations } = useLoaderData<typeof loader>();
	const { user } = useOutletContext<{ user: User }>();
	const navigation = useNavigation();

	return (
		<>
			{navigation.state === "loading" && (
				<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-[9999]">
					<div className="text-white text-2xl font-bold">Loading...</div>
				</div>
			)}
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
									location.parking_spots.length ||
								navigation.state === "loading";
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

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);

	const RETRY_LIMIT = 3;
	const formData = await request.formData();
	const locationName = formData.get("locationName");
	const userId = formData.get("userId");

	if (typeof locationName !== "string" || typeof userId !== "string")
		return { error: "Missing or invalid form fields" };

	const { data: parkingSpots, error: spotsError } = await supabase
		.from("parking_spots")
		.select("*")
		.eq("location", locationName);

	if (spotsError) return { error: spotsError.message };
	if (!parkingSpots?.length) return { error: "No parking spots found" };

	for (let i = 0; i < RETRY_LIMIT; i++) {
		const result = await reserveParkingSpot({
			supabase,
			userId,
			parkingSpots,
		});

		if (result && "success" in result) return redirect("/active-parking");
		if (result && "error" in result) return { error: result.error };
	}

	return { error: "Failed to reserve parking spot" };
};

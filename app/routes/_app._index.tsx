import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react/dist/components";
import ParkingLocationCard from "~/components/app/parking-location-card";
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
	return { parkingLocations: parkingLocations as ParkingLocation[] };
};

export default function Index() {
	const { parkingLocations } = useLoaderData<typeof loader>();
	const { user } = useOutletContext<{ user: User }>();

	return (
		<div className="flex flex-col gap-5 h-screen w-screen items-start pt-10 justify-start max-w-5xl mx-auto px-4">
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
							location.active_parking_spots >= location.parking_spots.length;
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
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);

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

	const { data: activeRequests, error: requestError } = await supabase
		.from("parking_requests")
		.select("parking_spot")
		.in(
			"parking_spot",
			parkingSpots.map((spot) => spot.id),
		)
		.eq("is_active", true);

	if (requestError) return { error: requestError.message };

	const unavailableIds = new Set(activeRequests?.map((r) => r.parking_spot));
	const availableSpot = parkingSpots.find((s) => !unavailableIds.has(s.id));

	if (!availableSpot) return { error: "No available parking spots" };

	const expires = getExpiryTime();

	const { error: insertError } = await supabase
		.from("parking_requests")
		.insert([
			{
				user_id: userId,
				parking_spot: availableSpot.id,
				is_active: true,
				created_at: new Date(),
				expires_at: expires,
			},
		])
		.select()
		.single();

	if (insertError) return { error: insertError.message };

	return redirect("/active-parking");
};

function getExpiryTime(): Date {
	const now = new Date();
	const expires = new Date(now);
	expires.setHours(17, 0, 0, 0);
	if (now > expires) {
		expires.setDate(expires.getDate() + 1);
		expires.setHours(0, 0, 0, 0);
	}
	return expires;
}

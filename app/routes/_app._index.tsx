import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react/dist/components";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

type User = {
	id: string;
	email: string;
	license_plate: string;
};

type ParkingLocation = {
	Name: string;
	created_at: string;
	is_indoors: boolean | null;
	parking_spots: {
		id: string;
		name: string;
		is_active: boolean;
	}[];
	active_parking_spots: number;
};

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
			<div className="flex flex-col items-center gap-16 w-full">
				<div className="flex flex-col items-center gap-9">
					<h1 className="text-2xl font-bold">Welcome {user.email}</h1>
					<p className="text-sm text-muted-foreground">
						Select a parking location
					</p>
				</div>
				<div className="flex flex-col gap-4 w-full">
					{parkingLocations.map((location) => (
						<Form method="post" key={location.Name}>
							<input type="hidden" name="locationName" value={location.Name} />
							<input type="hidden" name="userId" value={user.id} />
							<button type="submit" className="w-full text-left">
								<Card className="w-full hover:scale-95 transition-all duration-300 cursor-pointer">
									<CardHeader>
										<div className="flex justify-between items-center w-full">
											<CardTitle>{location.Name}</CardTitle>
											<p className="text-sm text-muted-foreground">
												{location.active_parking_spots} /{" "}
												{location.parking_spots.length}
											</p>
										</div>
										<CardDescription>
											{location.is_indoors ? "Indoors" : "Outdoors"}
										</CardDescription>
									</CardHeader>
								</Card>
							</button>
						</Form>
					))}
				</div>
			</div>
		</div>
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) return redirect("/login");

	const formData = await request.formData();
	const locationName = formData.get("locationName") as string | null;
	const userId = formData.get("userId") as string | null;

	if (!locationName || !userId) {
		console.error("Missing location name or user id");
		return { error: "Missing location name or user id" };
	}

	const { data: parkingSpots, error: spotsError } = await supabase
		.from("parking_spots")
		.select("*")
		.eq("location", locationName);

	if (spotsError || !parkingSpots?.length) {
		console.error("No parking spots found for location");
		return { error: "No parking spots found" };
	}

	for (const spot of parkingSpots) {
		const { data: activeRequest, error: requestError } = await supabase
			.from("parking_requests")
			.select("id")
			.eq("parking_spot", spot.id)
			.eq("is_active", true)
			.maybeSingle();

		if (requestError) {
			console.error(requestError);
			continue;
		}

		if (!activeRequest) {
			const { error: insertError } = await supabase
				.from("parking_requests")
				.insert([
					{
						user_id: userId,
						parking_spot: spot.id,
						is_active: true,
						created_at: new Date(),
						expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
					},
				])
				.select()
				.single();

			if (insertError) {
				console.error("Insert error:", insertError);
				return { error: insertError.message };
			}

			return redirect("/active-parking");
		}
	}

	return { error: "No available parking spots at this location" };
};

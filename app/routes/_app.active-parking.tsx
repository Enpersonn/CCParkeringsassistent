import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { useRouteError } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react/dist/components";
import { Button } from "~/components/ui/button";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError || !userData?.user) {
		return redirect("/login");
	}

	const user = userData.user;

	const { data: parkingRequest } = await supabase
		.from("parking_requests")
		.select("*")
		.eq("user_id", user.id)
		.eq("is_active", true)
		.single();

	if (!parkingRequest) return redirect("/");

	const { data: parkingSpot } = await supabase
		.from("parking_spots")
		.select("*")
		.eq("id", parkingRequest.parking_spot)
		.single();

	const { data: parkingLocation } = await supabase
		.from("parking_locations")
		.select("*")
		.eq("Name", parkingSpot.location)
		.single();

	return {
		id: parkingRequest.id,
		location_name: parkingLocation.Name,
		parking_spot: {
			id: parkingSpot.id,
			name: parkingSpot.Name,
		},
	};
};

export default function ActiveParking() {
	const { id, location_name, parking_spot } = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-col gap-5 h-screen w-screen items-start pt-10 justify-start max-w-5xl mx-auto px-4">
			<div className="flex flex-col items-center gap-16 w-full">
				<div className="flex flex-col items-center gap-9">
					<h1 className="text-2xl font-bold">Active Parking</h1>
					<p className="text-sm text-muted-foreground">
						You are currently parked at {location_name} in spot{" "}
						{parking_spot.name}.
					</p>

					<Form method="post">
						<input type="hidden" name="parkingRequestId" value={id} />
						<Button type="submit" variant="destructive">
							Leave Parking
						</Button>
					</Form>
				</div>
			</div>
		</div>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	return (
		<div className="flex flex-col items-center gap-16 h-screen w-screen justify-center">
			<h1>Error</h1>
			<p>{error instanceof Error ? error.message : "Unknown error"}</p>
		</div>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();
	const parkingRequestId = formData.get("parkingRequestId");

	if (!parkingRequestId) return { error: "Missing parkingRequestId" };

	const id = Number(parkingRequestId);

	const { error: parkingRequestError } = await supabase
		.from("parking_requests")
		.update({ is_active: false })
		.eq("id", id)
		.single();

	if (parkingRequestError) {
		return { error: "Failed to leave parking" };
	}

	return redirect("/");
}

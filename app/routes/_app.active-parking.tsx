import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react/dist/components";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import AdminButton from "~/components/general/admin-button";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { User } from "~/types/app/user";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError || !userData?.user) return redirect("/login");

	const user = userData.user;

	const { data: parkingRequest } = await supabase
		.from("parking_requests")
		.select("*")
		.eq("user_id", user.id)
		.eq("is_active", true)
		.single();

	if (
		parkingRequest.expires_at &&
		new Date(parkingRequest.expires_at) < new Date()
	) {
		await supabase
			.from("parking_requests")
			.update({ is_active: false })
			.eq("id", parkingRequest.id);
		return redirect("/");
	}

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
		expires_at: parkingRequest.expires_at,
		location_name: parkingLocation.Name,
		created_at: parkingRequest.created_at,
	};
};

export default function ActiveParking() {
	const { id, location_name, expires_at, created_at } =
		useLoaderData<typeof loader>();
	const { user } = useOutletContext<{ user: User }>();

	return (
		<div className="flex flex-col gap-5 h-screen w-screen secondary  items-start pt-10 md:pt-20 justify-start max-w-xl mx-auto px-4 relative">
			<AdminButton isAdmin={user.is_admin} />
			<div className="flex flex-col items-center gap-4 w-full">
				<h1 className="text-2xl font-bold">Du har parkert!</h1>
			</div>
			<Card className="flex flex-col items-center gap-16 w-full">
				<CardHeader className="flex flex-col items-center gap-9 justify-start">
					<p className="text-sm text-muted-foreground flex items-center gap-2 justify-start">
						Lokasjon: {location_name} <MapPinIcon className="size-4" />
					</p>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-3">
						<CalendarIcon className="size-6 text-muted-foreground" />
						<p className="text-base text-muted-foreground">
							Startet parkering:{" "}
							{new Date(created_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
						<p className="text-base text-muted-foreground">
							Du er parkert til{" "}
							{new Date(expires_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</CardContent>
			</Card>
			<Form method="post" className="w-full">
				<input type="hidden" name="parkingRequestId" value={id} />
				<Button type="submit" variant="destructive" className="w-full">
					Avslutt parkering
				</Button>
			</Form>
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

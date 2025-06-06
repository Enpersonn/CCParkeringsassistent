import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react/dist/components";
import AdminButton from "~/components/general/admin-button";
import { Button } from "~/components/ui/button";
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
	};
};

export default function ActiveParking() {
	const { id, location_name, expires_at } = useLoaderData<typeof loader>();
	const { user } = useOutletContext<{ user: User }>();

	return (
		<div className="flex flex-col gap-5 h-screen w-screen items-start pt-10 justify-start max-w-5xl mx-auto px-4 relative">
			<AdminButton isAdmin={user.is_admin} />
			<div className="flex flex-col items-center gap-16 w-full">
				<div className="flex flex-col items-center gap-9">
					<h1 className="text-2xl font-bold">Du er parkert</h1>
					<p className="text-sm text-muted-foreground">
						Du er parkert på {location_name}.
					</p>
					<p className="text-sm text-muted-foreground">
						Du kan parkert til {expires_at}.
					</p>

					<Form method="post">
						<input type="hidden" name="parkingRequestId" value={id} />
						<Button type="submit" variant="destructive">
							Avslutt parkering
						</Button>
					</Form>
				</div>
			</div>
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

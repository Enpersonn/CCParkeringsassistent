import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ParkingRequest } from "~/types/app/parking-request";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	const { data: parkingRequests, error: parkingRequestsError } =
		await supabase.functions.invoke("get-parking-requests", {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"x-api-key": process.env.ADMIN_API_KEY as string,
			},
			body: {
				access_token: session.access_token,
			},
		});
	if (parkingRequestsError) throw new Error(parkingRequestsError.message);

	const sortedParkingRequests = parkingRequests.requests.sort(
		(a: ParkingRequest, b: ParkingRequest) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);

	return { data: sortedParkingRequests };
};

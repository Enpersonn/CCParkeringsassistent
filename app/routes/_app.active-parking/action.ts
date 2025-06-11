import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { invalidateCacheByPrefix } from "~/utils/cache.server";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();
	const parkingRequestId = formData.get("parkingRequestId");

	if (!parkingRequestId) return { error: "Missing parkingRequestId" };

	const id = Number(parkingRequestId);

	const now = DateTime.now().setZone("Europe/Oslo");

	const { error: parkingRequestError } = await supabase
		.from("parking_requests")
		.update({ is_active: false, disabled_at: now.toJSDate() })
		.eq("id", id)
		.single();

	if (parkingRequestError) return { error: "Failed to leave parking" };

	invalidateCacheByPrefix("parking-locations");
	invalidateCacheByPrefix("parking-spot-session");
	invalidateCacheByPrefix("parking-location");

	return redirect("/");
}

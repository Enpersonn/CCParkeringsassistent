import type { ActionFunctionArgs } from "@remix-run/node";
import { DateTime } from "luxon";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();

	const id = formData.get("id");

	if (!id) return { error: "ID is required" };

	const { error } = await supabase
		.from("parking_requests")
		.update({ is_active: false, disabled_at: DateTime.now().setZone("Europe/Oslo").toJSDate() })
		.eq("id", id);

	if (error) return { error: error.message };

	return { success: "Parking request deactivated" };
}

import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { invalidateCache } from "~/utils/cache.server";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();

	const name = formData.get("Name");

	if (!name) return { error: "Navn er påkrevd" };

	const { error } = await supabase
		.from("parking_locations")
		.delete()
		.eq("Name", name);

	if (error) return { error: error.message };

	await invalidateCache("parking-locations-list");

	return redirect("/admin/parking-locations");
}

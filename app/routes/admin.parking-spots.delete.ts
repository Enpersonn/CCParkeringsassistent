import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();

	const id = formData.get("id");

	if (!id) return { error: "ID is required" };

	const { data, error } = await supabase
		.from("parking_spots")
		.delete()
		.eq("id", id);

	if (error) return { error: error.message };

	return redirect("/admin/parking-spots");
}

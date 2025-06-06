import type { ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);

	const formData = await request.formData();

	const name = formData.get("name");

	if (!name) return { error: "Navn er påkrevd" };

	const { data, error } = await supabase.from("parking_locations").insert({
		Name: name,
	});

	if (error) return { error: error.message };

	return { success: true };
}

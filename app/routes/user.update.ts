import type { ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const user = await supabase.auth.getUser();
	const formData = await request.formData();
	const licensePlate = formData.get("license_plate");
	const { error } = await supabase
		.from("profiles")
		.update({
			license_plate: licensePlate,
		})
		.eq("id", user.data.user?.id);
	if (error) throw new Error(error.message);
	return { success: true };
}

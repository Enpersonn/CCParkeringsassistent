import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const token = formData.get("user_access_token");

	if (!token || typeof token !== "string") {
		return { error: "Missing token" };
	}
	const { supabase } = getSupabaseServerClient(request);

	const response = await supabase.functions.invoke(
		`${process.env.SUPABASE_FUNCTION_DELETE_USER}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	if (response.error) {
		return { error: response.error.message };
	}

	return redirect("/login");
};

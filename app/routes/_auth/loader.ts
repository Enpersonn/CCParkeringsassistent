import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import { redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) return redirect("/");

	return null;
}

import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data, error } = await supabase.from("parking_locations").select("*");
	if (error) throw new Error(error.message);
	return { data };
};

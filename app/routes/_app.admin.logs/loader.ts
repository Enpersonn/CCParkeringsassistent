import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const { data, error } = await supabase.from("parking_requests").select("*");
	if (error) throw new Error(error.message);

	const createdAt = data?.map((log) => {
		return {
			...log,
			created_at: new Date(log.created_at).toLocaleString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
	});

	const disabled_at = data?.map((log) => {
		return {
			id: log.id,
			user_id: log.user_id,
			parking_spot: log.parking_spot,
			disabled_at: new Date(log.disabled_at).toLocaleString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
	});

	return createdAt;
}

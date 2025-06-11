import type { LoaderFunctionArgs } from "@remix-run/node";
import { generateCacheKey, getCachedData } from "~/utils/cache.server";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const cachedData = await getCachedData(
		{
			key: generateCacheKey("admin-logs", {
				timestamp: new Date().toISOString(),
			}),
			ttl: 1000 * 60 * 2,
		},
		async () => {
			const { data, error } = await supabase
				.from("parking_requests")
				.select("*");
			if (error) throw new Error(error.message);
			return { rawLogs: data };
		},
	);
	const rawLogs = cachedData.rawLogs;

	const logs = [];

	for (const log of rawLogs) {
		if (log.created_at) {
			logs.push({
				id: log.id,
				user_id: log.user_id,
				parking_spot: log.parking_spot,
				timestamp: log.created_at,
				event_type: "created",
			});
		}
		if (log.disabled_at) {
			logs.push({
				id: log.id,
				user_id: log.user_id,
				parking_spot: log.parking_spot,
				timestamp: log.disabled_at,
				event_type: "disabled",
			});
		}
	}

	logs.sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
	);

	const formattedLogs = logs.map((log) => ({
		...log,
		timestamp: new Intl.DateTimeFormat("nb-NO", {
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Europe/Oslo",
		}).format(new Date(log.timestamp)),
	}));

	return { logs: formattedLogs };
}

import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: session, error: sessionError } =
		await supabase.auth.getSession();

	if (!session || sessionError) return { hasSession: false };

	return { hasSession: true };
};

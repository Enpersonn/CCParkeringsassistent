import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data, error } = await supabase.from("guests").select("*");

	if (error) throw new Error(error.message);

	return { data };
};
export default function AdminGuests() {
	const { data } = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>Guests</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}

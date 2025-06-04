import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase, headers } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return redirect("/login");
	}
	return new Response(JSON.stringify(user));
}

export default function App() {
	const { user } = useLoaderData<typeof loader>();
	console.log("user", user);
	return <Outlet context={{ user }} />;
}

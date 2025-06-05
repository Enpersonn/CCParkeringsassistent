import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user || user.app_metadata?.role !== "admin") {
		return redirect("/login");
	}

	const data = {
		user: {
			id: user.id,
			email: user.email,
		},
	};

	return data;
}

export default function Admin() {
	const { user } = useLoaderData<typeof loader>();
	return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
	return <div>Error: {error.message}</div>;
}

import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	const { data: userData } = await supabase
		.from("profiles")
		.select("license_plate")
		.eq("id", user.id)
		.single();

	const data = {
		user: {
			id: user.id,
			email: user.email,
			license_plate: userData?.license_plate,
		},
	};

	return data;
}

export default function App() {
	const { user } = useLoaderData<typeof loader>();
	return <Outlet context={{ user }} />;
}

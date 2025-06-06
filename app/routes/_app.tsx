import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { Toaster } from "~/components/ui/sonner";
import type { User } from "~/types/app/user";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import GlobalErrorBoundary from "~/view/global-error-boundary";
import { NuqsAdapter } from "nuqs/adapters/remix";
export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect("/login");

	const { data: userData } = await supabase
		.from("profiles")
		.select("license_plate, is_verified")
		.eq("id", user.id)
		.single();

	if (!userData || !userData.is_verified) return redirect("/auth/callback");

	return {
		id: user.id,
		email: user.email,
		license_plate: userData?.license_plate,
		is_admin: user.app_metadata?.role === "admin",
	} as User;
}

export default function App() {
	const user = useLoaderData<typeof loader>();
	return (
		<NuqsAdapter>
			<Outlet context={{ user }} />
			<Toaster />
		</NuqsAdapter>
	);
}

export function ErrorBoundary() {
	return <GlobalErrorBoundary />;
}

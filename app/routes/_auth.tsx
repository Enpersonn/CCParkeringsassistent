import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import GlobalErrorBoundary from "~/view/global-error-boundary";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) return redirect("/");

	return null;
}

export default function Auth() {
	return <Outlet />;
}

export function ErrorBoundary() {
	return <GlobalErrorBoundary />;
}

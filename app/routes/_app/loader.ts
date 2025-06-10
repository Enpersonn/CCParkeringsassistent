import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { User } from "~/types/app/user";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const session = await supabase.auth.getSession();

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
		access_token: session.data.session?.access_token,
	} as User;
}

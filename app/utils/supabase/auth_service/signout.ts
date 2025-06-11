import { redirect } from "@remix-run/node";
import { getSupabaseServerClient } from "../supabase.server";

export async function signOut(request: Request) {
	const { supabase } = getSupabaseServerClient(request);
	await supabase.auth.signOut();
	return redirect("/login");
}

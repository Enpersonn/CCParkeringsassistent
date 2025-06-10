import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { invalidateCache, invalidateCacheByPrefix } from "~/utils/cache.server";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const id = formData.get("id");
	const email = formData.get("email");
	const actionType = formData.get("type");
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	if (!id) throw new Error("User ID is required");

	if (actionType === "resetPassword") {
		const { error } = await supabase.functions.invoke("reset-user-password", {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"x-api-key": process.env.ADMIN_API_KEY as string,
			},
			body: {
				access_token: session.access_token,
				user_id: id,
				email: email,
			},
		});
		if (error) return { error: `Failed to reset password: ${error.message}` };
		return { message: "Passord tilbakestilt" };
	}

	if (actionType === "deleteUser") {
		const { error } = await supabase.functions.invoke("delete-user", {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"x-api-key": process.env.ADMIN_API_KEY as string,
			},
			body: {
				access_token: session.access_token,
				user_id: id,
				email: email,
			},
		});
		if (error) return { error: `Failed to delete user: ${error.message}` };
		invalidateCacheByPrefix("admin-users-list");
		return redirect("/admin/users");
	}

	if (actionType === "verifyUser") {
		const { error } = await supabase
			.from("profiles")
			.update({
				is_verified: true,
			})
			.eq("id", id);
		if (error) return { error: `Failed to verify user: ${error.message}` };
		return { message: "Bruker verifisert" };
	}

	if (actionType === "makeAdmin") {
		const { error } = await supabase.functions.invoke("make-admin", {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"x-api-key": process.env.ADMIN_API_KEY as string,
			},
			body: {
				access_token: session.access_token,
				user_id: id,
			},
		});
		if (error) return { error: `Failed to make admin: ${error.message}` };
		return { message: "Bruker gjort til admin" };
	}

	return { error: "Invalid action type" };
}

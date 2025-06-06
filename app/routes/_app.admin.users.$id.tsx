import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import { Button } from "~/components/ui/button";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import React from "react";
import DeleteUserDialog from "~/components/admin/user/delete-user-dialog";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const { id } = params;
	if (!id) {
		throw new Error("User ID is required");
	}

	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const personalUserId = sessionData.session?.user.id;
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", id)
		.single();

	if (profileError) {
		console.error("Profile fetch error:", profileError);
		throw new Error(`Failed to fetch profile: ${profileError.message}`);
	}

	const { data: userData, error: userError } = await supabase.functions.invoke(
		"get-user",
		{
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"x-api-key": process.env.ADMIN_API_KEY as string,
			},
			body: {
				access_token: session.access_token,
				user_id: id,
				email: profile?.email,
			},
		},
	);

	const user = userData.user;

	if (userError) {
		console.error("User fetch error:", userError);
		throw new Error(`Failed to fetch user: ${userError.message}`);
	}

	if (!user) {
		throw new Error("User not found");
	}

	const data = {
		id: user.id,
		email: user.email,
		is_admin: user?.app_metadata?.role === "admin",
		is_verified: profile?.is_verified,
		personal_user_id: personalUserId,
	};

	return { data };
};

export default function AdminUser() {
	const { data } = useLoaderData<typeof loader>();
	const fetcher = useFetcher();

	React.useEffect(() => {
		// @ts-ignore
		if (fetcher.data?.message) {
			// @ts-ignore
			toast.success(fetcher.data.message);
		}
		// @ts-ignore
		if (fetcher.data?.error) {
			// @ts-ignore
			toast.error(fetcher.data.error);
		}
	}, [fetcher.data]);

	return (
		<div className="flex md:flex-row flex-col justify-between gap-4">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold">{data.email}</h1>
				<h2 className="text-sm text-muted-foreground">ID: {data.id}</h2>
				<div className="flex gap-2">
					<fetcher.Form method="post">
						<button type="submit" name="type" value="verifyUser">
							<Badge
								variant="secondary"
								className={cn(
									data.is_verified ? "bg-green-500" : "bg-destructive",
								)}
							>
								{data.is_verified ? "Verified" : "Unverified"}
							</Badge>
						</button>
						<DeleteUserDialog
							userId={data.id}
							personalUserId={data.personal_user_id || ""}
						/>
						<input type="hidden" name="type" value="verifyUser" />
						<input type="hidden" name="id" value={data.id} />
					</fetcher.Form>
					{data.is_admin && (
						<Badge variant="secondary" className="bg-yellow-300 text-black">
							Admin
						</Badge>
					)}
				</div>
			</div>
			<Form method="post" className="flex gap-2">
				<Button type="submit" name="type" value="resetPassword">
					Reset Password
				</Button>

				<input type="hidden" name="id" value={data.id} />
				<input type="hidden" name="email" value={data.email} />
			</Form>
		</div>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const id = formData.get("id");
	const email = formData.get("email");
	const actionType = formData.get("type");
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	if (!id) {
		throw new Error("User ID is required");
	}

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
		if (error) {
			console.error("Reset password error:", error);
			return { error: `Failed to reset password: ${error.message}` };
		}
		return { message: "Password reset email sent" };
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
		if (error) {
			console.error("Delete user error:", error);
			return { error: `Failed to delete user: ${error.message}` };
		}
		return { message: "User deleted successfully" };
	}

	if (actionType === "verifyUser") {
		const { error } = await supabase
			.from("profiles")
			.update({
				is_verified: true,
			})
			.eq("id", id);
		if (error) {
			console.error("Verify user error:", error);
			return { error: `Failed to verify user: ${error.message}` };
		}
		return { message: "User verified successfully" };
	}

	return { error: "Invalid action type" };
}

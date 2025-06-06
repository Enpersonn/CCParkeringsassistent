import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
	createColumnHelper,
	useReactTable,
	getCoreRowModel,
} from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import BasicTable from "~/components/general/table/basic-table";
import { Button } from "~/components/ui/button";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";
import { getCachedData, generateCacheKey } from "~/utils/cache.server";

type User = {
	id: string;
	email: string;
	is_verified?: boolean;
	is_admin?: boolean;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	// Use caching for user list data
	const response = await getCachedData(
		{
			key: generateCacheKey("admin-users-list", { userId: session.user.id }),
			ttl: 1000 * 60 * 5, // Cache for 5 minutes
		},
		async () => {
			const edgeRes = await supabase.functions.invoke("list-users", {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
					"x-api-key": process.env.ADMIN_API_KEY as string,
				},
				body: {
					access_token: session.access_token,
				},
			});

			const { data: profileData } = await supabase.from("profiles").select("*");

			const users = edgeRes.data.users.map(
				(user: {
					id: string;
					email: string;
					app_metadata: { role: string };
				}) => {
					const profile = profileData?.find((p) => p.id === user.id);
					return {
						id: user.id,
						email: user.email,
						is_admin: user?.app_metadata?.role === "admin",
						is_verified: profile?.is_verified,
					};
				},
			);

			if (!edgeRes.data) throw new Error("Failed to fetch users");
			return users;
		},
	);

	return { data: response };
};

export default function AdminUsers() {
	const { data } = useLoaderData<typeof loader>();

	const columnHelper = createColumnHelper<User>();

	const columns = [
		columnHelper.accessor("email", {
			header: "Email",
		}),
		columnHelper.accessor("is_verified", {
			header: "Verified",
		}),
		columnHelper.accessor("is_admin", {
			header: "Admin",
		}),
		columnHelper.accessor("id", {
			header: "View",
			cell: ({ getValue }) => {
				return (
					<Button asChild variant="ghost" size="icon">
						<Link to={`/admin/users/${getValue()}`}>
							<EyeIcon className="size-4" />
						</Link>
					</Button>
				);
			},
		}),
	];

	const tableInstance = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div>
			<BasicTable table={tableInstance} />
		</div>
	);
}

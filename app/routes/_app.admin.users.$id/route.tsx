import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import React from "react";
import { toast } from "sonner";
import DeleteUserDialog from "~/components/admin/user/delete-user-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { loader as loaderFn } from "./loader";

export { action } from "./action";
export { loader } from "./loader";
export default function AdminUser() {
	const { data } = useLoaderData<typeof loaderFn>();
	const fetcher = useFetcher();

	React.useEffect(() => {
		// @ts-ignore
		if (fetcher.data?.message) toast.success(fetcher.data.message);

		// @ts-ignore
		if (fetcher.data?.error) toast.error(fetcher.data.error);
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
								{data.is_verified ? "Verifisert" : "Uverifisert"}
							</Badge>
						</button>

						<input type="hidden" name="type" value="verifyUser" />
						<input type="hidden" name="id" value={data.id} />
					</fetcher.Form>
					<fetcher.Form method="post">
						<button type="submit" name="type" value="makeAdmin">
							<Badge
								variant="secondary"
								className={cn(
									data.is_admin ? "bg-yellow-300 text-black" : "bg-muted",
								)}
							>
								Admin
							</Badge>
						</button>
						<input type="hidden" name="type" value="makeAdmin" />
						<input type="hidden" name="id" value={data.id} />
					</fetcher.Form>
				</div>
			</div>
			<Form method="post" className="flex gap-2">
				<Button
					type="submit"
					name="type"
					value="resetPassword"
					disabled={fetcher.state !== "idle"}
				>
					Tilbakestill passord
				</Button>
				<DeleteUserDialog
					userId={data.id}
					personalUserId={data.personal_user_id || ""}
				/>

				<input type="hidden" name="id" value={data.id} />
				<input type="hidden" name="email" value={data.email} />
			</Form>
		</div>
	);
}

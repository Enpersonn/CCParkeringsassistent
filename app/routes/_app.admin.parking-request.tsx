import type { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { toast } from "sonner";
import BasicTable from "~/components/general/table/basic-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { ParkingRequest } from "~/types/app/parking-request";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase } = getSupabaseServerClient(request);
	const { data: sessionData } = await supabase.auth.getSession();
	const session = sessionData.session;

	if (!session) throw new Error("Not authenticated");

	const { data: parkingRequests, error: parkingRequestsError } =
		await supabase.functions.invoke("get-parking-requests", {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"x-api-key": process.env.ADMIN_API_KEY as string,
			},
			body: {
				access_token: session.access_token,
			},
		});
	if (parkingRequestsError) throw new Error(parkingRequestsError.message);

	const sortedParkingRequests = parkingRequests.requests.sort(
		(a: ParkingRequest, b: ParkingRequest) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);

	return { data: sortedParkingRequests };
};

export default function AdminParkingRequest() {
	const fetcher = useFetcher();
	const { data } = useLoaderData<typeof loader>();
	const columnHelper = createColumnHelper<ParkingRequest>();

	const handleDisableActive = (id: number) => {
		fetcher.submit(
			{ id },
			{ method: "post", action: "/admin/parking-request/disable-active" },
		);
	};

	React.useEffect(() => {
		// @ts-ignore
		if (fetcher.state === "idle" && fetcher.data) {
			// @ts-ignore
			if (fetcher.data.success && "success" in fetcher.data) {
				toast.success("Parkeringsplass deaktivert!");
				// @ts-ignore
			} else if (fetcher.data.error && "error" in fetcher.data) {
				toast.error(`Feil: ${fetcher.data.error}`);
			}
		}
	}, [fetcher.state, fetcher.data]);

	const columns = [
		columnHelper.accessor("is_active", {
			header: "Aktiv",
			cell: ({ getValue }) => {
				return (
					<div>
						{getValue() ? (
							<Badge variant="default">Ja</Badge>
						) : (
							<Badge variant="destructive">Nei</Badge>
						)}
					</div>
				);
			},
		}),
		columnHelper.accessor("user.email", {
			header: "Bruker",
		}),
		columnHelper.accessor("parking_spots.Name", {
			header: "Parkeringsplass",
		}),
		columnHelper.accessor("parking_spots.location", {
			header: "Lokasjon",
		}),
		columnHelper.accessor("id", {
			header: "ID",
		}),
		columnHelper.accessor("id", {
			header: " ",
			id: "deactivate-parking-button",
			cell: ({ row }) => {
				return row.getValue("is_active") ? (
					<Button
						variant="outline"
						disabled={fetcher.state === "submitting"}
						onClick={() => handleDisableActive(row.getValue("id"))}
					>
						Deaktiver
					</Button>
				) : null;
			},
		}),
	];
	const tableInstance = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div className="flex flex-col gap-4">
			<BasicTable table={tableInstance} />
		</div>
	);
}

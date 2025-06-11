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
import type { loader as loaderFn } from "./loader";

export default function ParkingRequestTable() {
	const fetcher = useFetcher();
	const { data } = useLoaderData<typeof loaderFn>();
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
		columnHelper.accessor("created_at", {
			header: "Oprettet tid",
			cell: ({ getValue }) => {
				return (
					<div>
						{new Intl.DateTimeFormat("nb-NO", {
							hour: "2-digit",
							minute: "2-digit",
							timeZone: "Europe/Oslo",
						}).format(new Date(getValue()))}
					</div>
				);
			},
		}),
		columnHelper.accessor("disabled_at", {
			header: "Deaktivert tid",
			cell: ({ getValue }) => {
				return (
					<div>
						{getValue()
							? new Intl.DateTimeFormat("nb-NO", {
									hour: "2-digit",
									minute: "2-digit",
									timeZone: "Europe/Oslo",
								}).format(new Date(getValue() as string))
							: "-"}
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
						disabled={fetcher.state !== "idle"}
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
	return <BasicTable table={tableInstance} />;
}

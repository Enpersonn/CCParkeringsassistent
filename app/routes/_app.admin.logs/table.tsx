import { useLoaderData } from "@remix-run/react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import BasicTable from "~/components/general/table/basic-table";
import { Badge } from "~/components/ui/badge";
import type { loader } from "./loader";

export default function LogsTable() {
	const { logs } = useLoaderData<typeof loader>();

	const columnHelper = createColumnHelper<(typeof logs)[number]>();

	const columns = [
		columnHelper.accessor("id", {
			header: "ID",
			cell: ({ row, getValue }) => {
				const type = row.original.event_type;
				return (
					<div className="flex items-center gap-2">
						<span>
							{type === "created" ? (
								<ArrowUp className="size-4 text-green-500" />
							) : type === "disabled" ? (
								<ArrowDown className="size-4 text-red-500" />
							) : (
								<Minus className="size-4" />
							)}
						</span>
						{getValue()}
					</div>
				);
			},
		}),
		columnHelper.accessor("user_id", {
			header: "Bruker ID",
		}),
		columnHelper.accessor("parking_spot", {
			header: "Parkeringsplass",
		}),

		columnHelper.accessor("timestamp", {
			header: "Log",
			cell: ({ getValue }) => {
				return <Badge variant="outline">{getValue()}</Badge>;
			},
		}),
		columnHelper.accessor("event_type", {
			header: "Type",
			cell: ({ getValue }) => {
				const type = getValue();
				return type === "created" ? "Aktivert" : "Deaktivert";
			},
		}),
	];

	const tableInstance = useReactTable({
		data: logs,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return <BasicTable table={tableInstance} />;
}

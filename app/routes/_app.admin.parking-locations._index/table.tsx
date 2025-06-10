import { createColumnHelper } from "@tanstack/react-table";
import BasicTable from "~/components/general/table/basic-table";
import { useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import type { ParkingLocation } from "~/types/app/parking-location";
import { useQueryState } from "nuqs";
import type { loader as loaderFn } from "./loader";
import { useLoaderData } from "@remix-run/react";

const ParkingLocationsTable = () => {
	const { data } = useLoaderData<typeof loaderFn>();
	const [_, setName] = useQueryState<string>("Name", {
		parse: (value) => value || "",
		serialize: (value) => value,
	});

	const columnHelper = createColumnHelper<ParkingLocation>();
	const columns = [
		columnHelper.accessor("Name", {
			header: "Navn",
		}),
		columnHelper.accessor("is_indoors", {
			header: "Innendørs",
			cell: ({ getValue }) => {
				return <Badge>{getValue() ? "Ja" : "Nei"}</Badge>;
			},
		}),
		columnHelper.accessor("Name", {
			header: " ",
			id: "delete-location",
			cell: ({ getValue }) => {
				return (
					<div className="flex flex-row gap-2 justify-end">
						<Button
							variant="destructive"
							onClick={() => {
								setName(getValue());
							}}
						>
							<TrashIcon className="size-4" />
						</Button>
					</div>
				);
			},
		}),
	];

	const tableInstance = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return <BasicTable table={tableInstance} />;
};

export default ParkingLocationsTable;

import { useLoaderData } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect } from "react";
import { useState } from "react";
import { useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { EyeIcon } from "lucide-react";
import BasicTable from "~/components/general/table/basic-table";
import type { ParkingSpot } from "~/types/app/parking-spot";
import type { loader as loaderFn } from "./loader";
import { useQueryState } from "nuqs";

const ParkingSpotsTable = () => {
	const { data } = useLoaderData<typeof loaderFn>();
	const columnHelper = createColumnHelper<ParkingSpot>();
	const [selectedLocation] = useQueryState<string>("location", {
		parse: (value) => value || "all",
		serialize: (value) => value,
	});
	const [filteredData, setFilteredData] = useState<ParkingSpot[]>(data);

	useEffect(() => {
		if (!selectedLocation || selectedLocation === "all") {
			setFilteredData(data);
		} else {
			setFilteredData(
				data.filter((spot) => spot.location === selectedLocation),
			);
		}
	}, [selectedLocation, data]);

	const columns = [
		columnHelper.accessor("Name", {
			header: "Navn",
		}),
		columnHelper.accessor("location", {
			header: "Lokasjon",
		}),
		columnHelper.accessor("id", {
			header: "Se",
			cell: ({ getValue }) => {
				return (
					<Button asChild variant="ghost" size="icon">
						<Link to={`/admin/parking-spots/${getValue()}`}>
							<EyeIcon className="size-4" />
						</Link>
					</Button>
				);
			},
		}),
	];

	const tableInstance = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return <BasicTable table={tableInstance} />;
};

export default ParkingSpotsTable;

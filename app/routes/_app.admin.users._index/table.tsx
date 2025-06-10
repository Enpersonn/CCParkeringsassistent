import { useLoaderData } from "@remix-run/react";
import type { loader as loaderFn } from "./loader";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import BasicTable from "~/components/general/table/basic-table";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { EyeIcon } from "lucide-react";

const UsersTable = () => {
	const { data } = useLoaderData<typeof loaderFn>();

	const columnHelper = createColumnHelper<(typeof data)[number]>();

	const columns = [
		columnHelper.accessor("email", {
			header: "Email",
		}),
		columnHelper.accessor("is_verified", {
			header: "Verifisert",
		}),
		columnHelper.accessor("is_admin", {
			header: "Admin",
		}),
		columnHelper.accessor("id", {
			header: "Se",
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
	return <BasicTable table={tableInstance} />;
};

export default UsersTable;

import { useLoaderData } from "@remix-run/react";
import StatsCard from "~/components/admin/dashboard/stats-card";
import type { loader as loaderFn } from "./loader";

export { loader } from "./loader";
export default function AdminIndex() {
	const { data } = useLoaderData<typeof loaderFn>();
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{data.map((item) => (
				<StatsCard key={item.title} {...item} />
			))}
		</div>
	);
}

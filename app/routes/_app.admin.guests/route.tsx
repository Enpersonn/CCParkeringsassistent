import { useLoaderData } from "@remix-run/react";
import type { loader as loaderFn } from "./loader";

export { loader } from "./loader";

export default function AdminGuests() {
	const { data } = useLoaderData<typeof loaderFn>();

	return (
		<div>
			<h1>Gjester</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}

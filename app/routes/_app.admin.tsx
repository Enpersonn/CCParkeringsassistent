import type { LoaderFunctionArgs } from "@remix-run/node";
import {
	Link,
	Outlet,
	redirect,
	useLoaderData,
	useLocation,
	useNavigate,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { getSupabaseServerClient } from "~/utils/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user || user.app_metadata?.role !== "admin") {
		return redirect("/login");
	}

	const data = {
		user: {
			id: user.id,
			email: user.email,
		},
	};

	return data;
}

export default function Admin() {
	const { user } = useLoaderData<typeof loader>();
	const location = useLocation();
	return (
		<div className="flex flex-col gap-5 h-screen w-screen items-start pt-10 justify-start max-w-5xl mx-auto px-4">
			<header className="  w-full grid grid-cols-2 gap-4">
				<Button
					asChild
					disabled={location.pathname === "/admin"}
					variant={location.pathname === "/admin" ? "secondary" : "default"}
				>
					<Link to="/admin">
						<p>Dashboard</p>
					</Link>
				</Button>
				<Button asChild className="col-start-2">
					<Link to="/">
						<p>Back to app</p>
					</Link>
				</Button>
			</header>
			<Card className=" w-full">
				<CardHeader className="flex flex-row justify-between items-center gap-4">
					<CardTitle className="text-xl font-bold">Admin</CardTitle>
					<Button asChild>
						<Link to="/admin/logs">View logs</Link>
					</Button>
				</CardHeader>
				<CardContent>
					<Outlet />
				</CardContent>
			</Card>
		</div>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	return <div>Error: {error.message}</div>;
}

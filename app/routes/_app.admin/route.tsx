import { Link, Outlet, useLocation, useNavigate } from "@remix-run/react";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export { loader } from "./loader";

export default function Admin() {
	const location = useLocation();
	const navigate = useNavigate();

	const handleBack = () => {
		const pathSegments = location.pathname.split("/").filter(Boolean);
		pathSegments.pop();
		const newPath =
			pathSegments.length > 0 ? `/${pathSegments.join("/")}` : "/admin";
		navigate(newPath);
	};

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
					<Link prefetch="intent" to="/">
						<p>Tilbake til app</p>
					</Link>
				</Button>
			</header>
			<Card className=" w-full">
				<CardHeader className="flex flex-row justify-between items-center gap-4">
					<div className="flex flex-row items-center gap-2">
						{location.pathname !== "/admin" && (
							<Button variant="ghost" onClick={handleBack}>
								<ChevronLeftIcon className="size-4" />
							</Button>
						)}
						<CardTitle className="text-xl font-bold">Admin</CardTitle>
					</div>
					<Button variant="outline" asChild>
						<Link to="/admin/logs">Se logg</Link>
					</Button>
				</CardHeader>
				<CardContent>
					<Outlet />
				</CardContent>
			</Card>
		</div>
	);
}

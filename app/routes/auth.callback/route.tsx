import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useLoaderData } from "@remix-run/react";
import type { loader as loaderFn } from "./loader";

export { loader } from "./loader";
export default function AuthCallback() {
	const { hasSession } = useLoaderData<typeof loaderFn>();

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col gap-4 items-center justify-center max-w-5xl mx-auto px-4">
				<div>
					<h1 className="text-2xl font-bold text-center">
						Kontoen din blir behandlet
					</h1>
					<p className="text-sm text-muted-foreground">
						For å få tilgang til appen, må en admin verifisere kontoen din.
					</p>
				</div>
				<div className="flex flex-col gap-2 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Vennligst sjekk tilbake senere.
					</p>
					{hasSession ? (
						<Button asChild>
							<Link to="/">Gå til forsiden</Link>
						</Button>
					) : (
						<Button asChild>
							<Link to="/login">Logg inn</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

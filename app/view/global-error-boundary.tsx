import { useNavigate, useRouteError } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function GlobalErrorBoundary() {
	const error = useRouteError();
	const navigate = useNavigate();
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-4">
			<h1 className="text-2xl font-bold">Noe gikk galt</h1>
			<p className="text-sm text-muted-foreground">
				Vi beklager, men det oppsto en uventet feil.
			</p>
			<p className="text-sm text-muted-foreground">
				Vennligst prøv å laste siden på nytt, eller kontakt support hvis
				problemet vedvarer.
			</p>

			<Button onClick={() => navigate(-1)} className="mt-4">
				Refresh Page
			</Button>
			<div className="text-sm text-muted-foreground">
				{error instanceof Error ? (
					<pre>
						{error.message}
						<br />
						{error.stack}
					</pre>
				) : (
					<pre>{JSON.stringify(error, null, 2)}</pre>
				)}
			</div>
		</div>
	);
}

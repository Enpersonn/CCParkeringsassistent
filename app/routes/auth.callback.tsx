import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function AuthCallback() {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col gap-4 items-center justify-center">
				<div>
					<h1 className="text-2xl font-bold">
						Your account is being processed
					</h1>
					<p className="text-sm text-muted-foreground">
						To access the app, an admin must verify your account.
					</p>
				</div>
				<div className="flex flex-col gap-2 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Please check back later.
					</p>
					<Button>
						<Link to="/login">Login</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

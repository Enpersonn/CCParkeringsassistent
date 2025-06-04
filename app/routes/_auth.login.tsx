import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function Login() {
	return (
		<div>
			<h1>login</h1>
			<Button asChild>
				<Link to="/signup">Sign up</Link>
			</Button>
		</div>
	);
}

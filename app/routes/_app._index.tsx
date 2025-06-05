import { useOutletContext } from "@remix-run/react";
import { Link } from "@remix-run/react/dist/components";

type User = {
	id: string;
	email: string;
	license_plate: string;
};
export default function Index() {
	const { user } = useOutletContext<{ user: User }>();

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-16">
				<header className="flex flex-col items-center gap-9">
					<h1>Welcome {user.email}</h1>
				</header>
				<Link to="/auth/signout">Sign out</Link>
			</div>
		</div>
	);
}

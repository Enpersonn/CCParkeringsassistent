import { Link } from "@remix-run/react/dist/components";
import { Button } from "../ui/button";

const AdminButton = ({ isAdmin }: { isAdmin: boolean }) => {
	return (
		isAdmin && (
			<div className="absolute top-0 right-2 flex flex-col  justify-end w-fit">
				<Button variant="outline" asChild className="w-fit rounded-t-none">
					<Link to="/admin">Admin</Link>
				</Button>
			</div>
		)
	);
};

export default AdminButton;

import type { User } from "~/types/app/user";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogTrigger,
	DialogHeader,
} from "../ui/dialog";
import { Link, useOutletContext } from "@remix-run/react";
import { SettingsIcon } from "lucide-react";
import DeleteUserDialog from "./delete-user-dialog";

export default function ProfileSettingsDialog() {
	const { user } = useOutletContext<{ user: User }>();
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant="ghost" size="icon">
					<SettingsIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Innstillinger</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-24">
					<div className="flex flex-col gap-6">
						<p className="text-sm text-muted-foreground">
							Bruker: {user.email}
						</p>
						<div className="flex flex-col gap-4">
							<Button variant="outline" disabled>
								Generer gjestnøkkel (Kommer snart)
							</Button>
							<Button variant="outline" asChild>
								<Link to="/auth/signout">Logg ut</Link>
							</Button>
						</div>
					</div>
					<DeleteUserDialog />
				</div>
			</DialogContent>
		</Dialog>
	);
}

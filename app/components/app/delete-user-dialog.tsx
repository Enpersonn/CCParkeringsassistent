import { Form, useFetcher } from "@remix-run/react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogTrigger,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "../ui/dialog";
import { useOutletContext } from "@remix-run/react";
import type { User } from "~/types/app/user";
import { Loader2 } from "lucide-react";

export default function DeleteUserDialog() {
	const { user } = useOutletContext<{ user: User }>();
	const fetcher = useFetcher();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">Slett bruker</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Slett bruker</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Er du sikker på at du vil slette brukeren? Dette kan ikke reverseres.
				</DialogDescription>
				<DialogFooter>
					<fetcher.Form method="post" action="/auth/delete-user">
						<input
							type="hidden"
							name="user_access_token"
							value={user.access_token}
						/>
						<DialogClose asChild>
							<Button
								variant="destructive"
								type="submit"
								disabled={fetcher.state !== "idle"}
							>
								{fetcher.state !== "idle" ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									"Slett bruker"
								)}
							</Button>
						</DialogClose>
					</fetcher.Form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

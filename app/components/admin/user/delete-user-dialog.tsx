import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

export default function DeleteUserDialog({
	userId,
	personalUserId,
}: { userId: string; personalUserId: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="destructive"
					disabled={userId === personalUserId}
				>
					Slett bruker
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Slett bruker</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Er du sikker på at du vil slette denne brukeren? Denne handlingen kan
					ikke angres.
				</DialogDescription>
				<DialogFooter>
					<Form method="post" className="flex gap-2 w-full justify-end">
						<Button
							type="submit"
							name="type"
							value="deleteUser"
							variant="destructive"
							disabled={userId === personalUserId}
						>
							Slett bruker
						</Button>
						<Button type="button" variant="outline">
							Avbryt
						</Button>
						<input type="hidden" name="id" value={userId} />
					</Form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

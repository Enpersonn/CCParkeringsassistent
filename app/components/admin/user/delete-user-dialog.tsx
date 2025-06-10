import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

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
					<Button type="button" variant="outline">
						Avbryt
					</Button>
					<Button
						type="submit"
						name="type"
						value="deleteUser"
						variant="destructive"
						disabled={userId === personalUserId}
					>
						Slett bruker
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

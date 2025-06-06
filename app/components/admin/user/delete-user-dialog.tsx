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
					Delete User
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Are you sure you want to delete this user? This action cannot be
					undone.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="submit"
						name="type"
						value="deleteUser"
						variant="destructive"
						disabled={userId === personalUserId}
					>
						Delete User
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

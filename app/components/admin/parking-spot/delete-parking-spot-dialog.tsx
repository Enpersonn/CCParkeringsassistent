import { useFetcher } from "@remix-run/react";
import { TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

export default function DeleteParkingSpotDialog({ id }: { id: string }) {
	const fetcher = useFetcher();

	React.useEffect(() => {
		// @ts-ignore
		if (fetcher.state === "idle" && fetcher.data) {
			// @ts-ignore
			if (fetcher.data.success && "success" in fetcher.data) {
				toast.success("Parkeringsplass slettet!");
				// @ts-ignore
			} else if (fetcher.data.error && "error" in fetcher.data) {
				toast.error(`Feil: ${fetcher.data.error}`);
			}
		}
	}, [fetcher.state, fetcher.data]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">
					<TrashIcon className="size-4" />
					Slett
				</Button>
			</DialogTrigger>
			<DialogContent>
				<fetcher.Form method="post" action={"/admin/parking-spots/delete"}>
					<input type="hidden" name="id" value={id} />
					<DialogTitle>Slett parkeringsplass</DialogTitle>
					<DialogDescription>
						Er du sikker på at du vil slette parkeringsplassen?
					</DialogDescription>
					<DialogFooter>
						<Button variant="destructive" type="submit">
							<TrashIcon className="size-4" />
							Slett
						</Button>
					</DialogFooter>
				</fetcher.Form>
			</DialogContent>
		</Dialog>
	);
}

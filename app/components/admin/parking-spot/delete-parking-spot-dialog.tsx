import { useFetcher } from "@remix-run/react";
import { Loader2, TrashIcon } from "lucide-react";
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
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-1 justify-start">
							<DialogTitle>Slett parkeringsplass</DialogTitle>
							<DialogDescription>
								Er du sikker på at du vil slette parkeringsplassen?
							</DialogDescription>
						</div>
						<DialogFooter>
							<Button
								variant="destructive"
								type="submit"
								disabled={fetcher.state === "submitting"}
							>
								{fetcher.state === "submitting" ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<>
										<TrashIcon className="size-4" />
										Slett
									</>
								)}
							</Button>
						</DialogFooter>
					</div>
				</fetcher.Form>
			</DialogContent>
		</Dialog>
	);
}

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
} from "~/components/ui/dialog";
import { useQueryState } from "nuqs";

export default function DeleteParkingLocationDialog() {
	const fetcher = useFetcher();

	const [Name, setName] = useQueryState<string>("Name", {
		defaultValue: "",
		parse: (value) => value || "",
		serialize: (value) => value,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data) {
			// @ts-ignore
			if (fetcher.data.success && "success" in fetcher.data) {
				toast.success("Lokasjon slettet!");
				setName("");
				// @ts-ignore
			} else if (fetcher.data.error && "error" in fetcher.data) {
				toast.error(`Feil: ${fetcher.data.error}`);
			}
		}
	}, [fetcher.state, fetcher.data]);

	return (
		<Dialog open={Name !== ""} onOpenChange={() => setName("")}>
			<DialogContent>
				<fetcher.Form method="post" action={"/admin/parking-locations/delete"}>
					<input type="hidden" name="Name" value={Name} />
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-1 justify-start">
							<DialogTitle>Slett lokasjon</DialogTitle>
							<DialogDescription>
								Er du sikker på at du vil slette lokasjonen?
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

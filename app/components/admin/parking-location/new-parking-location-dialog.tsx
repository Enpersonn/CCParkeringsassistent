import { useFetcher } from "@remix-run/react";
import { Loader2, PlusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

const NewParkingLocationDialog = () => {
	const fetcher = useFetcher();
	const [isOpen, setIsOpen] = React.useState(false);
	React.useEffect(() => {
		// @ts-ignore
		if (fetcher.state === "idle" && fetcher.data) {
			// @ts-ignore
			if (fetcher.data.success && "success" in fetcher.data) {
				toast.success("Lokasjon lagt til!");
				setIsOpen(false);
				// @ts-ignore
			} else if (fetcher.data.error && "error" in fetcher.data) {
				toast.error(`Feil: ${fetcher.data.error}`);
			}
		}
	}, [fetcher.state, fetcher.data]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<PlusIcon className="size-4" />
					Ny lokasjon
				</Button>
			</DialogTrigger>
			<DialogContent>
				<fetcher.Form
					method="post"
					action="/admin/parking-locations/new"
					className="flex flex-row pt-2 gap-2"
				>
					<Input type="text" placeholder="Navn" name="name" />

					<Button type="submit">
						{fetcher.state === "submitting" ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Legg til lokasjon"
						)}
					</Button>
				</fetcher.Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewParkingLocationDialog;

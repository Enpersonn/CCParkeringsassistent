import { useFetcher } from "@remix-run/react";
import { Loader2, PlusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

const NewParkingLocationDialog = () => {
	const fetcher = useFetcher();
	const [isOpen, setIsOpen] = React.useState(false);
	const [isIndoors, setIsIndoors] = React.useState(false);

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
				<DialogTitle className="hidden">Legg til lokasjon</DialogTitle>
				<fetcher.Form
					method="post"
					action="/admin/parking-locations/new"
					className="flex flex-col gap-4"
				>
					<div className="flex flex-col gap-2 pt-3">
						<Input type="text" placeholder="Navn" name="name" />
						<input
							type="hidden"
							name="is_indoors"
							value={isIndoors.toString()}
						/>
						<div className="flex flex-row gap-2 items-center ">
							<Label>Innendørs</Label>
							<Switch checked={isIndoors} onCheckedChange={setIsIndoors} />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">
							{fetcher.state !== "idle" ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								"Legg til lokasjon"
							)}
						</Button>
					</DialogFooter>
				</fetcher.Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewParkingLocationDialog;

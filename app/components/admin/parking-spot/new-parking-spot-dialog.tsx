import { useFetcher } from "@remix-run/react";
import { Loader2, PlusIcon } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { ParkingLocation } from "~/types/app/parking-location";
import NewParkingLocationDialog from "../parking-location/new-parking-location-dialog";
import { toast } from "sonner";
import React from "react";

const NewParkingSpotDialog = ({
	locations,
}: { locations: ParkingLocation[] }) => {
	const fetcher = useFetcher();
	const [isOpen, setIsOpen] = React.useState(false);
	const [selectedLocation, setSelectedLocation] = React.useState<string>("");
	React.useEffect(() => {
		// @ts-ignore
		if (fetcher.state === "idle" && fetcher.data) {
			// @ts-ignore
			if (fetcher.data.success && "success" in fetcher.data) {
				toast.success("Parkeringsplass opprettet!");
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
				<Button>
					<PlusIcon className="size-4" />
					Legg til parkeringsplass
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className="hidden">Legg til parkeringsplass</DialogTitle>
				<fetcher.Form
					method="post"
					action="/admin/parking-spots/new"
					className="flex flex-col gap-2"
				>
					<input type="hidden" name="location" value={selectedLocation} />
					<div className="flex flex-col gap-2">
						<Label>Lokasjon</Label>
						<div className="flex flex-row gap-2">
							<Select
								value={selectedLocation}
								onValueChange={setSelectedLocation}
							>
								<SelectTrigger>
									<SelectValue placeholder="Velg lokasjon" />
								</SelectTrigger>
								<SelectContent>
									{locations.map((location) => (
										<SelectItem key={location.Name} value={location.Name}>
											{location.Name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<NewParkingLocationDialog />
						</div>
					</div>
					<div>
						<Label>Navn</Label>
						<Input type="text" placeholder="Navn" name="name" />
					</div>
					<DialogFooter>
						<Button type="submit">
							{fetcher.state === "submitting" ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								"Legg til"
							)}
						</Button>
					</DialogFooter>
				</fetcher.Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewParkingSpotDialog;

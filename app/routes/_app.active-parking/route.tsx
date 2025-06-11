import {
	Form,
	useLoaderData,
	useNavigation,
	useOutletContext,
} from "@remix-run/react";
import { CalendarIcon, Loader2, MapPinIcon } from "lucide-react";
import AdminButton from "~/components/general/admin-button";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { User } from "~/types/app/user";
import type { loader as loaderFn } from "./loader";

export { loader } from "./loader";
export { action } from "./action";

export default function ActiveParking() {
	const { id, location_name, expires_at, created_at } =
		useLoaderData<typeof loaderFn>();
	const navigation = useNavigation();
	const { user } = useOutletContext<{ user: User }>();

	return (
		<div className="flex flex-col gap-5 h-screen w-screen secondary  items-start pt-10 md:pt-20 justify-start max-w-xl mx-auto px-4 relative">
			<AdminButton isAdmin={user.is_admin} />
			<div className="flex flex-col items-center gap-4 w-full">
				<h1 className="text-2xl font-bold">Du har parkert!</h1>
			</div>
			<Card className="flex flex-col items-center gap-16 w-full">
				<CardHeader className="flex flex-col items-center gap-9 justify-start">
					<p className="text-sm text-muted-foreground flex items-center gap-2 justify-start">
						Lokasjon: {location_name} <MapPinIcon className="size-4" />
					</p>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-3">
						<CalendarIcon className="size-6 text-muted-foreground" />
						<p className="text-base text-muted-foreground">
							Startet parkering:{" "}
							{new Intl.DateTimeFormat("nb-NO", {
								hour: "2-digit",
								minute: "2-digit",
								timeZone: "Europe/Oslo",
							}).format(new Date(created_at))}
						</p>
						<p className="text-base text-muted-foreground">
							Du er parkert til{" "}
							{new Intl.DateTimeFormat("nb-NO", {
								hour: "2-digit",
								minute: "2-digit",
								timeZone: "Europe/Oslo",
							}).format(new Date(expires_at))}
						</p>
					</div>
				</CardContent>
			</Card>
			<Form method="post" className="w-full">
				<input type="hidden" name="parkingRequestId" value={id} />
				<Button
					type="submit"
					variant="destructive"
					className="w-full"
					disabled={navigation.state !== "idle"}
				>
					{navigation.state !== "idle" ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						"Avslutt parkering"
					)}
				</Button>
			</Form>
		</div>
	);
}

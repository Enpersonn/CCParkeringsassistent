import { useFetcher, useOutletContext } from "@remix-run/react";
import React from "react";
import { Input } from "../ui/input";
import type { User } from "~/types/app/user";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const UpdateUserLicensePlateForm = () => {
	const fetcher = useFetcher();
	const { user } = useOutletContext<{ user: User }>();

	React.useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data) {
			// @ts-expect-error - fetcher.data is not typed
			if (fetcher.data.success) {
				toast.success("Skiltnummer oppdatert");
			} else {
				toast.error("Feil ved oppdatering av skiltnummer");
			}
		}
	}, [fetcher.state, fetcher.data]);

	return (
		<fetcher.Form method="post" action="/user/update">
			<Label>Skiltnummer</Label>
			<div className="flex gap-2">
				<Input
					type="text"
					name="license_plate"
					defaultValue={user.license_plate || ""}
				/>
				<Button type="submit" variant="outline">
					Oppdater
				</Button>
			</div>
		</fetcher.Form>
	);
};

export default UpdateUserLicensePlateForm;

import * as React from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export function CookieConsentBanner() {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const hasConsent = document.cookie
			.split("; ")
			.some((cookie) => cookie.startsWith(`${COOKIE_CONSENT_KEY}=`));

		if (!hasConsent) setOpen(true);
	}, []);

	const handleDismissDialog = () => {
		saveConsent();
		setOpen(false);
	};

	const saveConsent = () => {
		document.cookie = `${COOKIE_CONSENT_KEY}=true; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;
	};

	return (
		<Dialog open={open} onOpenChange={() => {}}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Cookie Innstillinger</DialogTitle>
					<DialogDescription>
						Denne nettsiden benytter informasjonskapsler for å sikre
						funksjonalitet og lagre brukersesjoner og at cookie er godjent. Vi
						benytter kun nødvendige cookies for å sikre at nettsiden fungerer.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex items-center space-x-2">
						<Checkbox id="necessary" checked={true} disabled />
						<Label htmlFor="necessary" className="flex flex-col gap-1">
							<span>Nødvendige</span>
							<span className="text-sm text-muted-foreground">
								Kreves for at applikasjonen skal fungere. Kan ikke deaktiveres.
							</span>
						</Label>
					</div>
				</div>
				<DialogFooter className="flex flex-col sm:flex-row gap-2">
					<Button onClick={handleDismissDialog} className="w-full sm:w-auto">
						Lukk
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

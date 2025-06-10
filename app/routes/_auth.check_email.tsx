export default function CheckEmail() {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-2xl font-bold">Sjekk din e-post</h1>
				<p className="text-sm text-muted-foreground">
					Vi har sendt en bekreftelseslenke til din e-postadresse.
				</p>
			</div>
		</div>
	);
}

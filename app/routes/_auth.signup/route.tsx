import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { action as actionFn } from "./action";

export { action } from "./action";

export default function Signup() {
	const actionData = useActionData<typeof actionFn>();
	const navigation = useNavigation();

	return (
		<div className="flex h-screen w-screen items-center justify-center max-w-5xl mx-auto px-4">
			<Form method="post" className="w-full">
				<Card className=" w-full space-y-4">
					<CardHeader>
						<CardTitle>Registrer deg</CardTitle>
					</CardHeader>
					<CardContent className="w-full space-y-4">
						<div className="flex flex-col gap-2 w-full">
							<Label>Email</Label>
							<Input type="email" name="email" />
							{actionData?.errors?.type === "validation" &&
								actionData.errors.email && (
									<p className="text-sm text-destructive">
										{actionData.errors.email[0]}
									</p>
								)}
						</div>
						<div className="flex gap-2 w-full">
							<div className="flex flex-col gap-2 w-full">
								<Label className="w-full">Passord</Label>
								<Input type="password" name="password" />
								{actionData?.errors?.type === "validation" &&
									actionData.errors.password && (
										<p className="text-sm text-destructive">
											{actionData.errors.password[0]}
										</p>
									)}
							</div>
							<div className="flex flex-col gap-2 w-full">
								<Label className="w-full">Bekreft passord</Label>
								<Input type="password" name="confirmPassword" />
								{actionData?.errors?.type === "validation" &&
									actionData.errors.confirmPassword && (
										<p className="text-sm text-destructive">
											{actionData.errors.confirmPassword[0]}
										</p>
									)}
							</div>
						</div>
						{actionData?.errors?.type === "form" && (
							<p className="text-sm text-destructive">
								{actionData.errors.form[0]}
							</p>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="link" asChild>
							<Link to="/login">Logg inn</Link>
						</Button>
						<Button type="submit" disabled={navigation.state !== "idle"}>
							{navigation.state !== "idle"
								? "Registrerer deg..."
								: "Registrer deg"}
						</Button>
					</CardFooter>
				</Card>
			</Form>
		</div>
	);
}

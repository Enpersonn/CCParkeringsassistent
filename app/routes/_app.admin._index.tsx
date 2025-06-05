import { PlusIcon } from "lucide-react";
import {
	Card,
	CardTitle,
	CardHeader,
	CardContent,
	CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";

export default function AdminIndex() {
	return (
		<div className="grid grid-cols-2 gap-4">
			<Card>
				<CardHeader className="flex flex-row justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Users</h2>
					<Button asChild variant={"link"} className="px-0">
						<Link to="/admin/users">Manage</Link>
					</Button>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-muted-foreground">Total Users:</p>
					<p className="text-lg font-bold">56</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Parking Spots</h2>
					<Button asChild variant={"link"} className="px-0">
						<Link to="/admin/parkingspots">Manage</Link>
					</Button>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-muted-foreground">Total Parking Spots:</p>
					<p className="text-lg font-bold">17</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Parking Requests</h2>
					<Button asChild variant={"link"} className="px-0">
						<Link to="/admin/parking_request">Manage</Link>
					</Button>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-muted-foreground">Total Active Parkings:</p>
					<p className="text-lg font-bold">13</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Guests</h2>
					<Button asChild variant={"link"} className="px-0">
						<Link to="/admin/guests">Manage</Link>
					</Button>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-muted-foreground">Total Active Guests:</p>
					<p className="text-lg font-bold">12</p>
				</CardContent>
			</Card>
		</div>
	);
}

import { data, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";

type StatsCardProps = {
	title: string;
	valueTitle: string;
	value: number;
	link: string;
};

const StatsCard = ({ title, valueTitle, value, link }: StatsCardProps) => {
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">{title}</h2>
				<Button asChild variant={"link"} className="px-0">
					<Link prefetch="intent" to={link}>
						Administrer
					</Link>
				</Button>
			</CardHeader>
			<CardContent className="flex justify-between items-center">
				<p className="text-muted-foreground">{valueTitle}</p>
				<p className="text-lg font-bold">{value}</p>
			</CardContent>
		</Card>
	);
};

export default StatsCard;

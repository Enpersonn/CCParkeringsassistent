import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";

type ParkingLocationCardProps = {
	isDisabled: boolean;
	isIndoors: boolean;
	name: string;
	activeParkingSpots: number;
	parkingSpots: number;
};

const ParkingLocationCard = ({ data }: { data: ParkingLocationCardProps }) => (
	<button
		type="submit"
		className={cn(
			"w-full transition-all duration-300 border rounded-md p-4 flex flex-col gap-2 items-start<",
			{
				"bg-muted": data.isDisabled,
				"shadow-sm hover:scale-95 hover:shadow-none active:scale-90":
					!data.isDisabled,
			},
		)}
		disabled={data.isDisabled}
	>
		<div className="flex justify-between items-center w-full">
			<h2 className="text-lg font-semibold">{data.name}</h2>
			<p className="text-sm text-muted-foreground">
				{data.activeParkingSpots} / {data.parkingSpots}
			</p>
		</div>
		<Badge
			variant={data.isDisabled ? "secondary" : "outline"}
			className="w-fit"
		>
			{data.isIndoors ? "Indoors" : "Outdoors"}
		</Badge>
	</button>
);

export default ParkingLocationCard;

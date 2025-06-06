export type ParkingLocation = {
	Name: string;
	created_at: string;
	is_indoors: boolean | null;
	parking_spots: {
		id: string;
		name: string;
		is_active: boolean;
	}[];
	active_parking_spots: number;
};

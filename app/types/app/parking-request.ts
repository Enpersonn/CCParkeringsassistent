export type ParkingRequest = {
	id: number;
	guest_id: string | null;
	created_at: string;
	is_active: boolean;
	disabled_at: string | null;
	expires_at: string;
	parking_spots: {
		id: number;
		Name: string;
		location: string;
		created_at: string;
		reserved_to: string | null;
		Max_vehicel_height: number | null;
		Max_vehiclel_width: number | null;
		Max_vehiclel_length: number | null;
	};
	user: {
		id: string;
		email: string;
		created_at: string;
		updated_at: string;
	};
};

import { z } from "zod";

export const newParkingSpotSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	location: z.string().min(1, { message: "Location is required" }),
	max_vehicel_height: z.number().optional().nullable(),
	max_vehicel_width: z.number().optional().nullable(),
	max_vehicel_length: z.number().optional().nullable(),
});

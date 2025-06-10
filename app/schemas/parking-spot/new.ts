import { z } from "zod";

export const newParkingSpotSchema = z.object({
	name: z.string().min(1, { message: "Navn er påkrevd" }),
	location: z.string().min(1, { message: "Lokasjon er påkrevd" }),
	max_vehicel_height: z.number().optional().nullable(),
	max_vehicel_width: z.number().optional().nullable(),
	max_vehicel_length: z.number().optional().nullable(),
});

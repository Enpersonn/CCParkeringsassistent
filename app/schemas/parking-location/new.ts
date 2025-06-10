import { z } from "zod";

export const newParkingLocationSchema = z.object({
	name: z.string().min(1),
	is_indoors: z.boolean(),
});

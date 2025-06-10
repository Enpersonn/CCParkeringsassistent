import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email({ message: "Ugyldig e-postadresse" }),
	password: z.string().min(6, { message: "Passord må være minst 6 tegn" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

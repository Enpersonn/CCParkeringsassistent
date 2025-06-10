import { z } from "zod";

export const signupSchema = z
	.object({
		email: z.string().email({ message: "Ugyldig e-postadresse" }),
		password: z.string().min(6, { message: "Passord må være minst 6 tegn" }),
		confirmPassword: z
			.string()
			.min(6, { message: "Passord må være minst 6 tegn" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passordene må være like",
		path: ["confirmPassword"],
	});

export type SignupSchema = z.infer<typeof signupSchema>;

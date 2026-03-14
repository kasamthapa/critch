import * as z from "zod";

export const userSignupSchema = z.object({
  username: z.string().min(1, { message: "username is required" }).trim(),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
export const userSignInSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

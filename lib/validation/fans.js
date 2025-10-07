import { z } from "zod";

export const FansSchema = z.object({
  name: z.string().nonempty("First Name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required").min(7, "Password must be at least 7 character"),
  telephone: z.string().nonempty("Telephone is required"),
});
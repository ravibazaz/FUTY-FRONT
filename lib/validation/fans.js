import { z } from "zod";

export const FansSchema = z.object({
  name: z.string().min(2,"First Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(7, "Password must be at least 7 character"),
  telephone: z.string().min(1,"Telephone is required"),
});
import { z } from "zod";

export const FansSchema = z.object({
  name: z.string().min(2,"First Name is required"),
    email: z.string().trim().superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
        });
        return; // stop further checks
      }
  
      if (!/\S+@\S+\.\S+/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email format",
        });
      }
    }),
  password: z.string().min(7, "Password must be at least 7 character"),
  telephone: z.string().min(1,"Telephone is required"),
});
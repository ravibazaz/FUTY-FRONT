import { z } from "zod";

export const ManagersSchema = (isEdit = false) => z.object({
  manager_name: z.string().min(2, "First Name is required"),
  manager_email: z.string().trim().superRefine((val, ctx) => {
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
  manager_phone: z.string()
    .trim()
    .min(10, { message: "Telephone must be at least 10 digits." })
    .max(11, { message: "Telephone must be at most 11 digits." })
    .regex(/^\d+$/, { message: " Digits only (0–9)" }),
  manager_nick_name: z.string().optional(),
  manager_address: z.string().optional(),
  user_id: z.string().optional(),
  team_id: z.string().min(2, "Team is required"),
});
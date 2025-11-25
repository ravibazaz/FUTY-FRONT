import { z } from "zod";

export const TeamSchema = (isEdit = false) => z.object({
  name: z.string().min(2, "Team Name is required"),
  ground: z.string().min(2, "Ground is required"),
  club: z.string().min(2, "Club is required"),
  phone: z.string()
  .trim()
  .min(10, { message: "Telephone must be at least 10 digits." })
  .max(11, { message: "Telephone must be at most 11 digits." })
  .regex(/^\d+$/, { message: " Digits only (0–9)" }),
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
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (file instanceof File) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        return file.size > 0 && allowedTypes.includes(file.type);
      }
      return true; // Pass if no new file is uploaded
    }, { message: "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." }),
  shirt: z.string().optional(),
  shorts: z.string().optional(),
  socks: z.string().optional(),
  attack: z.string().optional(),
  midfield: z.string().optional(),
  defence: z.string().optional(),
  age_groups: z.string().optional(),
});
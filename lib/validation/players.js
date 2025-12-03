import { z } from "zod";

export const PlayersSchema = (isEdit = false) => z.object({
  name: z.string().min(2, "First Name is required"),
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
  profile_image: z
    .any()
    .optional()
    .refine((file) => {
      if (file instanceof File) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        return file.size > 0 && allowedTypes.includes(file.type);
      }
      return true; // Pass if no new file is uploaded
    }, { message: "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." }),
  password: isEdit
    ? z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 7, {
        message: "Password must be at least 7 characters long",
      })
    : z.string().min(7, "Password must be at least 7 characters long"),
  telephone: z.string()
  .trim()
  .min(10, { message: "Telephone must be at least 10 digits." })
  .max(11, { message: "Telephone must be at most 11 digits." })
  .regex(/^\d+$/, { message: " Digits only (0–9)" }),
  surname: z.string().optional(),
  account_type: z.string().optional(),
  post_code: z.string().optional(),
  nick_name: z.string().optional(),
  profile_description: z.string().optional(),
  palyer_position: z.string().optional(),
  palyer_pace: z.string().optional(),
  palyer_skill: z.string().optional(),
  palyer_power: z.string().optional(),
  palyer_defence: z.string().optional(),
  palyer_teamwork: z.string().optional(),
  palyer_discipline: z.string().optional(),
  palyer_rating: z.string().optional(),
});
import { z } from "zod";

export const LeaguesSchema = (isEdit = false) => z.object({
  title: z.string().min(1, "League title is required"),
  p_name: z.string().min(1, "President Name is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (file instanceof File) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        return file.size > 0 && allowedTypes.includes(file.type);
      }
      return true; // Pass if no new file is uploaded
    }, { message: "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." })
    // Add this refine for the 3MB limit
    .refine((file) => {
      if (file instanceof File && file.size > 0) {
        const maxFileSize = 3 * 1024 * 1024; // 3MB in bytes
        return file.size <= maxFileSize;
      }
      return true;
    }, { message: "File size is too large. Max limit is 3MB." }),
  content: z.string().optional(),
  c_name: z.string().min(1, "Chariman Name is required"),
  s_name: z.string().min(1, "Secretary Name is required"),
  telephone: z.string().min(1, "Telephone is required"),
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
  age_groups: z.string().optional(),

});

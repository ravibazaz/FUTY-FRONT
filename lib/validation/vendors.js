import { z } from "zod";

export const VendorsSchema = (isEdit = false) => z.object({
  name: z.string().min(1, "Vendor title is required"),
  link: z.string().url("Enter a valid URL"),
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
  date: z.string().optional(),
  time: z.string().optional(),
  end_date: z.string().optional(),
  end_time: z.string().optional(),
  pages: z.string().optional()
});

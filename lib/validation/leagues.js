import { z } from "zod";

export const LeaguesSchema = (isEdit = false) => z.object({
  title: z.string().min(1, "League title is required"),
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
  content: z.string().optional(),
  name: z.string().optional(),
  ///url: z.string().url("Must be a valid URL").optional(),
  url: z.string().optional(),
  pin: z.string().optional()
});

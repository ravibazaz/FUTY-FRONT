import { z } from "zod";

export const AdvertsSchema = (isEdit = false) => z.object({
  name: z.string().min(1, "Advert title is required"),
  link: z.string().url("Enter a valid URL"),
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
  date: z.string().optional(),
  time: z.string().optional()
});

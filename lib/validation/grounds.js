import { z } from "zod";

export const GroundSchema = (isEdit = false) => z.object({
  name: z.string().min(2, "Ground Name is required"),
  add1: z.string().min(2, "Address 1 is required"),
  content: z.string().min(2, "Description is required"),
  pin: z.string().min(1, "Post code is required"),
  images: z
    .any()
    .optional()
    .refine((files) => {
      if (!files) return true; // no upload → allowed

      // Handle both single and multiple uploads safely
      const fileArray = Array.isArray(files) ? files : [files];

      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

      // Must have at least one valid file
      if (fileArray.length === 0) return false;

      // console.log(fileArray);
      // return false;
      
      // Validate each file type and size
      return fileArray.every(
        (file) => file instanceof File && file.size > 0 && allowedTypes.includes(file.type)
      );
    }, { message: "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." }),

  add2: z.string().optional(),
  add3: z.string().optional(),
});
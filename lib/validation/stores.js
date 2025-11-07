import { z } from "zod";

export const StoresSchema = (isEdit = false) => z.object({
  title: z.string().min(1, "Product title is required"),
  category: z.string().min(1, "Category is required"),
  price: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        // Blank → undefined (triggers "required")
        if (trimmed === "") return undefined;

        const num = Number(trimmed);

        // Non-numeric → NaN → undefined (triggers "required")
        if (isNaN(num)) return undefined;

        return num;
      }

      if (typeof val === "number") return val;
      return undefined;
    },
    z
      .number({ required_error: "Price is required" })
      .min(0, "Price cannot be negative")
      .refine((n) => Math.round(n * 100) === n * 100, {
        message: "Price can have at most 2 decimal places",
      })
  )
  ,
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
  ///url: z.string().url("Must be a valid URL").optional(),
  discount: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  product_code: z.string().optional(),
  other_product_info: z.string().optional(),
  shipping_cost: z.string().optional()
});

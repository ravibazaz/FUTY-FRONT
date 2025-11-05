import { z } from "zod";

export const AgeGroupSchema = (isEdit = false) => z.object({
  age_group: z.string().min(1, "Age Group title is required"),
  description: z.string().optional(),
});

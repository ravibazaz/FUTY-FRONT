import { z } from "zod";

export const GroundFacilitiesSchema = (isEdit = false) => z.object({
  facilities: z.string().min(1, "Facilities title is required"),
  description: z.string().optional(),
});

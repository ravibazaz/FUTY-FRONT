import { z } from "zod";

export const TeamSchema = (isEdit = false) => z.object({
  name: z.string().min(2, "Team Name is required"),
});
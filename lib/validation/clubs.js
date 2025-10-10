import { z } from "zod";

export const ClubSchema = (isEdit = false) => z.object({
  name: z.string().min(2, "Club Name is required"),
});
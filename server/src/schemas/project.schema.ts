import * as z from "zod";
export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  liveURL: z.string(),
  githubURL: z.string(),
  tags: z.string(),
});

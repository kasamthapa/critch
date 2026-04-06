import * as z from "zod";
export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  liveURL: z.string(),
  githubURL: z.string(),
  tags: z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val == "string") {
        return val
          .split(",")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);
      }
      // return [];
    },
    z.array(z.string()).min(1, "at least one tag is needed"),
  ),
});
export const projectEditSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  liveURL: z.string(),
  githubURL: z.string(),
  tags: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val == "string") {
      return val
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);
    }
    return [];
  }, z.array(z.string())),
});

export const reviewSchema = z.object({
  codeQuality: z.number(),
  uiDesign: z.number(),
  ideaScore: z.number(),
  documentation: z.number(),
  comment: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

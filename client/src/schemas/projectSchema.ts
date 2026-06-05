import * as z from "zod";
export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  liveURL: z.url(),
  githubURL: z.url(),
  tags: z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val == "string") {
        return val
          .split(",")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);
      }
      // return [];s
    },
    z.array(z.string()).min(1, "at least one tag is needed"),
  ),
  screenshot: z.instanceof(File, { message: "Screenshot is required" }),
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
  codeQuality: z.number().min(1).max(5),
  uiDesign: z.number().min(1).max(5),
  ideaScore: z.number().min(1).max(5),
  documentation: z.number().min(1).max(5),
  comment: z.string().min(1).max(5),
});
export const commentSchema = z.object({
  content: z.string().min(1),
  parentId: z.number().optional(),
});

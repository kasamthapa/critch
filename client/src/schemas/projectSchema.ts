import * as z from "zod";
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter a project title.")
    .max(100, "Title must be under 100 characters."),

  description: z
    .string()
    .min(1, "Please provide a short description of your project.")
    .max(1000, "Description cannot exceed 1000 characters."),

  liveURL: z
    .string()
    .min(1, "Live project URL is required.")
    .pipe(
      z.url("Please enter a valid website URL (e.g., https://example.com)."),
    ),

  githubURL: z
    .string()
    .min(1, "GitHub repository URL is required.")
    .pipe(z.url("Please enter a valid GitHub URL.")),

  tags: z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        return val
          .split(",")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);
      }
      return [];
    },

    z
      .array(z.string())
      .min(1, "Please add at least one tag to categorize your project."),
  ),

  screenshot: z.instanceof(File, {
    message: "Please upload a valid project screenshot image.",
  }),
});

export const projectEditSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title cannot be empty." })
    .max(100, { message: "Title must be under 100 characters." }),

  description: z
    .string()
    .min(1, { message: "Description cannot be empty." })
    .max(1000, { message: "Description cannot exceed 1000 characters." }),

  liveURL: z
    .string()
    .min(1, { message: "Live project URL is required." })
    .pipe(z.url("Please enter a valid website URL.")),

  githubURL: z
    .string()
    .min(1, { message: "GitHub URL is required." })
    .pipe(z.url("Please enter a valid URL.")),

  tags: z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        return val
          .split(",")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);
      }
      return [];
    },
    z.array(z.string()).min(1, { message: "Please include at least one tag." }),
  ),
});

export const reviewSchema = z.object({
  codeQuality: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  uiDesign: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  ideaScore: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  documentation: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().min(1, { message: "comment is required" }),
});
export const commentSchema = z.object({
  content: z.string().min(1),
  parentId: z.number().optional(),
});

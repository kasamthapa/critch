import { useState } from "react";
import { createProject } from "../api/project.api";
import { useNavigate } from "react-router-dom";
import type { CreateProjectRequest } from "../types/project.types";
import { projectSchema } from "../schemas/projectSchema";

function ProjectForm() {
  const initialValue = {
    title: "",
    description: "",
    liveURL: "",
    githubURL: "",
    tags: "",
  };

  const [formValues, setFormValues] = useState(initialValue);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreateProjectRequest, string>>
  >({});
  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof CreateProjectRequest]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (error) {
      setError("");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const fd = new FormData();
    fd.append("title", formValues.title);
    fd.append("description", formValues.description);
    fd.append("liveURL", formValues.liveURL);
    fd.append("githubURL", formValues.githubURL);
    fd.append("tags", formValues.tags);

    if (file) {
      const fileType = file.type;
      if (!fileType.startsWith("image/")) {
        setFieldErrors({ screenshot: "Only images are allowd" });
        return;
      } else {
        fd.append("screenshot", file);
      }
    }
    const validation = projectSchema.safeParse({
      ...formValues,
      screenshot: file,
    });
    if (!validation.success) {
      const errorsObj: Partial<Record<keyof CreateProjectRequest, string>> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof CreateProjectRequest;
        errorsObj[fieldName] = issue.message;
      });
      setFieldErrors(errorsObj);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createProject(fd);
      navigate(`/projects/${response.data.id}`, {
        state: { message: response.message },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111110] text-zinc-300 px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="font-mono text-xs sm:text-sm text-zinc-600 tracking-widest uppercase mb-3">
            critch / new
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            Create Project
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-zinc-500">
            Share your project with the community
          </p>
        </div>

        <div className="h-px bg-zinc-800 mb-8 sm:mb-10" />

        {/* Submitting */}
        {isSubmitting && (
          <div className="flex items-center gap-3 py-16 text-sm sm:text-base text-zinc-600">
            <span className="font-mono animate-pulse text-lg">···</span>
            <span>creating project</span>
          </div>
        )}

        {/* Form */}
        {!isSubmitting && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-7 sm:gap-8"
          >
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
              >
                Project Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter project title"
                value={formValues.title}
                onChange={handleChange}
                className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors font-mono min-h-[44px] ${
                  fieldErrors.title
                    ? "border-red-500 focus:border-red-400"
                    : "border-zinc-700 focus:border-zinc-400"
                }`}
              />
              {fieldErrors.title && (
                <span className="font-mono text-xs text-red-400 mt-0.5">
                  {fieldErrors.title}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={6}
                placeholder="Describe your project..."
                value={formValues.description}
                onChange={handleChange}
                className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none resize-none transition-colors leading-relaxed ${
                  fieldErrors.description
                    ? "border-red-500 focus:border-red-400"
                    : "border-zinc-700 focus:border-zinc-400"
                }`}
              />
              {fieldErrors.description && (
                <span className="font-mono text-xs text-red-400 mt-0.5">
                  {fieldErrors.description}
                </span>
              )}
            </div>

            {/* Live URL */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="liveUrl"
                className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
              >
                Live URL
              </label>
              <input
                type="text"
                name="liveURL"
                id="liveUrl"
                placeholder="https://yourproject.com"
                value={formValues.liveURL}
                onChange={handleChange}
                className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors font-mono min-h-[44px] ${
                  fieldErrors.liveURL
                    ? "border-red-500 focus:border-red-400"
                    : "border-zinc-700 focus:border-zinc-400"
                }`}
              />
              {fieldErrors.liveURL && (
                <span className="font-mono text-xs text-red-400 mt-0.5">
                  {fieldErrors.liveURL}
                </span>
              )}
            </div>

            {/* GitHub URL */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="githubUrl"
                className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
              >
                GitHub URL
              </label>
              <input
                type="text"
                name="githubURL"
                id="githubUrl"
                placeholder="https://github.com/user/repo"
                value={formValues.githubURL}
                onChange={handleChange}
                className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors font-mono min-h-[44px] ${
                  fieldErrors.githubURL
                    ? "border-red-500 focus:border-red-400"
                    : "border-zinc-700 focus:border-zinc-400"
                }`}
              />
              {fieldErrors.githubURL && (
                <span className="font-mono text-xs text-red-400 mt-0.5">
                  {fieldErrors.githubURL}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tags"
                className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
              >
                Tags
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                placeholder="react,typescript,nodejs"
                value={formValues.tags}
                onChange={handleChange}
                className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px] ${
                  fieldErrors.tags
                    ? "border-red-500 focus:border-red-400"
                    : "border-zinc-700 focus:border-zinc-400"
                }`}
              />
              {fieldErrors.tags ? (
                <span className="font-mono text-xs text-red-400 mt-0.5">
                  {fieldErrors.tags}
                </span>
              ) : (
                <p className="font-mono text-xs text-zinc-600">
                  separate tags with commas
                </p>
              )}
            </div>

            {/* Screenshot Upload */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="screenshot"
                className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
              >
                Project Screenshot
              </label>
              <label
                htmlFor="screenshot"
                className={`flex flex-col items-center justify-center gap-3 border border-dashed bg-zinc-900/50 px-6 py-8 text-center cursor-pointer transition-colors hover:bg-zinc-900 ${
                  fieldErrors.screenshot
                    ? "border-red-500 text-red-400"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <input
                  type="file"
                  id="screenshot"
                  name="screenshot"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="font-mono text-xs uppercase tracking-wider bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-zinc-300">
                  {file ? "Choose Different Image" : "Select File"}
                </span>
                <span className="text-xs text-zinc-500 truncate max-w-xs font-mono">
                  {file ? file.name : "no file selected (jpg, png, webp)"}
                </span>
              </label>
              {fieldErrors.screenshot && (
                <span className="font-mono text-xs text-red-400 mt-0.5">
                  {fieldErrors.screenshot}
                </span>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm text-red-400">
                <span className="font-mono text-red-500 select-none">✕</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 hover:text-white transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              create project
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProjectForm;

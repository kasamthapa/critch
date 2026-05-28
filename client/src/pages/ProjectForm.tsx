import { useState } from "react";
import { createProject } from "../api/project.api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("title", formValues.title);
    fd.append("description", formValues.description);
    fd.append("liveURL", formValues.liveURL);
    fd.append("githubURL", formValues.githubURL);
    fd.append("tags", formValues.tags);
    if (file) fd.append("screenshot", file);
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
                className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
              />
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
                className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none resize-none focus:border-zinc-400 transition-colors leading-relaxed"
              />
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
                className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
              />
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
                className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
              />
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
                className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
              />
              <p className="font-mono text-xs text-zinc-600">
                separate tags with commas
              </p>
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
                className={`flex flex-col items-center justify-center gap-3 border border-dashed px-6 py-8 sm:py-10 cursor-pointer transition-colors ${
                  file
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-900"
                }`}
              >
                <span className="font-mono text-2xl text-zinc-600">↑</span>
                {file ? (
                  <div className="text-center">
                    <p className="font-mono text-sm text-amber-400">
                      {file.name}
                    </p>
                    <p className="font-mono text-xs text-zinc-600 mt-1">
                      click to change
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-mono text-sm text-zinc-400">
                      click to upload screenshot
                    </p>
                    <p className="font-mono text-xs text-zinc-600 mt-1">
                      png, jpg, webp
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  name="screenshot"
                  id="screenshot"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm sm:text-base text-red-400">
                <span className="font-mono text-red-500 select-none mt-0.5">
                  ✕
                </span>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-5 py-3 border border-zinc-700 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all min-h-[44px]"
              >
                cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-3 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 hover:text-white transition-all min-h-[44px]"
              >
                create project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProjectForm;

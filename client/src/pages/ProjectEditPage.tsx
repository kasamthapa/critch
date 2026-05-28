import { useEffect, useState } from "react";
import { editProject } from "../api/project.api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { editProjectRequest } from "../types/project.types";

function ProjectEditPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [formValues, setFormValues] = useState({
    title: state?.title || "",
    description: state?.description || "",
    liveURL: state?.liveURL || "",
    githubURL: state?.githubURL || "",
    tags: state?.tags || "",
  });

  useEffect(() => {
    if (!location.state) {
      navigate(`/projects/${projectId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (projectId == undefined) {
      setError("Project id undefined");
      return;
    }
    setIsSubmitting(true);
    const payload: editProjectRequest = { ...formValues };
    try {
      const response = await editProject(payload, projectId);
      navigate(location.state?.from, { state: { message: response.message } });
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
            critch / edit
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            Edit Project
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-zinc-500">
            Update your project details and information
          </p>
        </div>

        <div className="h-px bg-zinc-800 mb-8 sm:mb-10" />

        {/* Submitting state */}
        {isSubmitting && (
          <div className="flex items-center gap-3 py-16 text-sm sm:text-base text-zinc-600">
            <span className="font-mono animate-pulse text-lg">···</span>
            <span>updating project</span>
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
                placeholder="Enter project description"
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
                update project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProjectEditPage;

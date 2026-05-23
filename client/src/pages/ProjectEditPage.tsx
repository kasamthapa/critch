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

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (projectId == undefined) {
      setError("Project id undefined");

      return;
    }

    setIsSubmitting(true);

    const payload: editProjectRequest = {
      ...formValues,
    };

    try {
      const response = await editProject(payload, projectId);

      navigate(location.state?.from, {
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
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Form Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-800">Edit Project</h1>

            <p className="text-zinc-500 mt-2">
              Update your project details and information
            </p>
          </div>

          {isSubmitting ? (
            <div className="text-center py-10 text-zinc-500">
              Updating project...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 font-medium text-zinc-700"
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
                  className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 font-medium text-zinc-700"
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
                  className="w-full border border-zinc-200 rounded-2xl px-4 py-4 bg-zinc-50 outline-none resize-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Live URL */}
              <div>
                <label
                  htmlFor="liveUrl"
                  className="block mb-2 font-medium text-zinc-700"
                >
                  Live URL
                </label>

                <input
                  type="text"
                  name="liveURL"
                  id="liveUrl"
                  placeholder="Enter your project's live URL"
                  value={formValues.liveURL}
                  onChange={handleChange}
                  className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Github URL */}
              <div>
                <label
                  htmlFor="githubUrl"
                  className="block mb-2 font-medium text-zinc-700"
                >
                  Github URL
                </label>

                <input
                  type="text"
                  name="githubURL"
                  id="githubUrl"
                  placeholder="Enter github repository URL"
                  value={formValues.githubURL}
                  onChange={handleChange}
                  className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block mb-2 font-medium text-zinc-700"
                >
                  Tags
                </label>

                <input
                  type="text"
                  name="tags"
                  id="tags"
                  placeholder="react,typescript,nodejs..."
                  value={formValues.tags}
                  onChange={handleChange}
                  className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
                />

                <p className="text-sm text-zinc-500 mt-2">
                  Separate tags with commas
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
                >
                  Update Project
                </button>
              </div>
            </form>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectEditPage;

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

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (file) {
      fd.append("screenshot", file);
    }

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
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Form Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-800">Create Project</h1>

            <p className="text-zinc-500 mt-2">
              Share your project with the community
            </p>
          </div>

          {isSubmitting ? (
            <div className="text-center py-10 text-zinc-500">
              Creating project...
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
                  placeholder="Describe your project..."
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
                  placeholder="https://yourproject.com"
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
                  placeholder="https://github.com/..."
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

              {/* Screenshot Upload */}
              <div>
                <label
                  htmlFor="screenshot"
                  className="block mb-2 font-medium text-zinc-700"
                >
                  Project Screenshot
                </label>

                <div className="border-2 border-dashed border-zinc-300 rounded-2xl bg-zinc-50 p-6 text-center">
                  <input
                    type="file"
                    name="screenshot"
                    id="screenshot"
                    onChange={handleFileChange}
                    className="w-full text-zinc-600"
                  />

                  {file && (
                    <p className="text-sm text-zinc-500 mt-3">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
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
                  Create Project
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

export default ProjectForm;

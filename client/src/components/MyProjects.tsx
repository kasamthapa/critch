import { useNavigate } from "react-router-dom";
import type { ProjectSummary } from "../types/project.types";
import { deleteProject } from "../api/project.api";
import { useState } from "react";

function MyProjects({
  projects,
  setFlashMessage,
  setError,
  setRefreshKey,
}: {
  projects: ProjectSummary[];
  setFlashMessage: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectId, setProjectId] = useState(0);

  async function handleDelete(id: number) {
    try {
      const response = await deleteProject(id);

      setFlashMessage(response.message);
      setIsDialogOpen(false);

      setRefreshKey((prev) => prev + 1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message);
    }
  }

  function handleDialogue(id: number) {
    setProjectId(id);
    setIsDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      {/* Container */}
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-800">My Projects</h1>

          <p className="text-zinc-500 mt-1">
            Manage and update your uploaded projects
          </p>
        </div>

        {/* Delete Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
              role="alertdialog"
              className="w-[90%] max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-zinc-800 mb-2">
                Delete Project
              </h2>

              <p className="text-zinc-500 mb-6">
                Are you sure you want to delete this project?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(projectId)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center text-zinc-500 shadow-sm">
            No projects found.
          </div>
        )}

        {/* Projects */}
        <div className="space-y-5">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Top */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                {/* Left */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-zinc-800">
                    {p.title}
                  </h2>

                  <p className="text-zinc-500 mt-2 line-clamp-2">
                    {p.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-zinc-100 text-sm text-zinc-700 border border-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
                    onClick={() =>
                      navigate(`/projects/edit/${p.id}`, {
                        state: {
                          title: p.title,
                          description: p.description,
                          liveURL: p.liveURL,
                          githubURL: p.githubURL,
                          tags: p.tags.join(","),
                          from: `/dashboard`,
                        },
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                    onClick={() => handleDialogue(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Bottom Links */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-zinc-200">
                {p.liveURL && (
                  <a
                    href={p.liveURL}
                    target="_blank"
                    className="text-sm text-zinc-700 hover:text-black font-medium"
                  >
                    Live Preview →
                  </a>
                )}

                {p.githubURL && (
                  <a
                    href={p.githubURL}
                    target="_blank"
                    className="text-sm text-zinc-700 hover:text-black font-medium"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyProjects;

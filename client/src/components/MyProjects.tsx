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
    <div>
      {/* Delete Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-4 sm:pb-0">
          <div
            role="alertdialog"
            className="w-full sm:w-auto sm:max-w-md bg-[#161614] border border-zinc-700 p-6 sm:p-8 shadow-2xl shadow-black/60"
          >
            <div className="mb-5 sm:mb-6">
              <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-3">
                confirm action
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                Delete project?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 leading-relaxed">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="h-px bg-zinc-800 mb-5 sm:mb-6" />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-5 py-3 border border-zinc-700 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all min-h-[44px]"
              >
                cancel
              </button>
              <button
                onClick={() => handleDelete(projectId)}
                className="px-5 py-3 border border-red-500/50 bg-red-500/10 font-mono text-sm text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all min-h-[44px]"
              >
                delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="border border-zinc-800 border-dashed px-6 sm:px-8 py-16 sm:py-20 text-center">
          <p className="font-mono text-xs sm:text-sm text-zinc-600 mb-2">
            0 projects
          </p>
          <p className="text-sm sm:text-base text-zinc-500">
            You haven't uploaded any projects yet.
          </p>
        </div>
      )}

      {/* Project list */}
      <div className="flex flex-col divide-y divide-zinc-800/70">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="group relative py-6 sm:py-7 -mx-3 sm:-mx-4 px-3 sm:px-4 transition-colors hover:bg-zinc-900/40"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200" />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 sm:gap-4 mb-1.5">
                  <span className="font-mono text-xs sm:text-sm text-zinc-700 shrink-0 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 truncate">
                    {p.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-zinc-500 leading-relaxed line-clamp-2 ml-7 sm:ml-8">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 ml-7 sm:ml-8">
                  {p.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="font-mono text-[11px] sm:text-xs text-zinc-500 border border-zinc-800 px-2 sm:px-2.5 py-1 bg-zinc-900/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-5 mt-3 sm:mt-4 ml-7 sm:ml-8">
                  {p.liveURL && (
                    <a
                      href={p.liveURL}
                      target="_blank"
                      className="font-mono text-xs sm:text-sm text-zinc-500 underline underline-offset-4 decoration-zinc-700 hover:text-amber-400 hover:decoration-amber-400/50 transition-colors"
                    >
                      live ↗
                    </a>
                  )}
                  {p.githubURL && (
                    <a
                      href={p.githubURL}
                      target="_blank"
                      className="font-mono text-xs sm:text-sm text-zinc-500 underline underline-offset-4 decoration-zinc-700 hover:text-amber-400 hover:decoration-amber-400/50 transition-colors"
                    >
                      src ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 sm:pt-1 shrink-0">
                <button
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
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-mono text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all min-h-[44px]"
                >
                  edit
                </button>
                <button
                  onClick={() => handleDialogue(p.id)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-2.5 font-mono text-sm text-red-400 hover:bg-red-500/20 hover:border-red-400/50 transition-all min-h-[44px]"
                >
                  delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProjects;

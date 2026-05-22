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
  console.log(projects[0].tags);
  return (
    <div className="relative min-h-screen">
      <h1 className="text-center text-3xl border-b-2 border-black font-extrabold">
        My-Projects
      </h1>

      {/* 1. Full-screen backdrop overlay and centered dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            role="alertdialog"
            className="w-[90%] max-w-md border-2 border-black bg-white p-6 shadow-xl flex justify-center flex-col items-center gap-4"
          >
            <p className="text-lg font-semibold">Are you sure?</p>
            <div className="flex gap-5">
              <button
                onClick={() => handleDelete(projectId)}
                className="bg-green-600 rounded p-2 text-white font-medium cursor-pointer hover:bg-green-700"
              >
                Confirm
              </button>

              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-red-500 rounded p-2 text-white font-medium cursor-pointer hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Simplified projects container layout */}
      <div>
        {projects.map((p) => (
          <div
            key={p.id}
            className="h-20 w-full cursor-pointer border-2 border-black rounded mt-3 flex justify-between items-center p-2"
          >
            <p className="text-xl">{p.title}</p>

            <div className="flex gap-8">
              <button
                className="bg-green-600 rounded p-2 cursor-pointer text-white"
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
                className="bg-red-500 rounded p-2 cursor-pointer text-white"
                onClick={() => handleDialogue(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProjects;

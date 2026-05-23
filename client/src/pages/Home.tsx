import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProjects } from "../api/project.api";
import type { ProjectSummary } from "../types/project.types";
import { useAuth } from "../hooks/useAuth";

export function Home() {
  const [projects, setProjects] = useState<Array<ProjectSummary>>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [tags, setTags] = useState<Array<string>>([]);
  const [selectedTag, setSelectedTag] = useState("");

  const [flashMessage, setFlashMessage] = useState(
    location.state?.message || "",
  );

  const { user } = useAuth();

  function handleTagSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTag(e.target.value);
  }

  function handleProjectClick(id: number) {
    navigate(`/projects/${id}`);
  }

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);

      try {
        const response = await getProjects(selectedTag);

        setProjects(response.data.projects);

        if (!selectedTag) {
          const allTags = response.data.projects.flatMap((p) => p.tags);

          const uniqueTags = [...new Set(allTags)];

          setTags(uniqueTags);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    makeRequest();
  }, [selectedTag]);

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      {/* Container */}
      <div className="max-w-6xl mx-auto">
        {/* Flash Message */}
        {flashMessage && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {flashMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-800">
              Explore Projects
            </h1>

            <p className="text-zinc-500 mt-1">
              Discover and review developer projects
            </p>
          </div>

          {user && (
            <button
              onClick={() => navigate("/projects/new")}
              className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
            >
              Create Project
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-sm font-medium text-zinc-700">
              Filter by tag
            </label>

            <select
              name="tag"
              onChange={handleTagSelect}
              value={selectedTag}
              className="border border-zinc-200 rounded-xl px-4 py-2 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All projects</option>

              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20 text-zinc-500">
            Loading projects...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center text-zinc-500 shadow-sm">
            No projects found.
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => handleProjectClick(p.id)}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              {/* Image */}
              <div className="h-52 overflow-hidden bg-zinc-200">
                <img
                  src={p.screenshotURL}
                  alt="projectScreenshot"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-800">
                      {p.title}
                    </h2>

                    <p className="text-sm text-zinc-500 mt-1">
                      by {p.author.username}
                    </p>
                  </div>

                  <div className="bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700">
                    ⭐ {p.avgRating || 0}
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-600 mt-4 line-clamp-3">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-sm text-zinc-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-200">
                  <p className="text-sm text-zinc-500">
                    {p._count.reviews} Reviews
                  </p>

                  <div className="flex gap-4">
                    {p.liveURL && (
                      <a
                        href={p.liveURL}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-zinc-700 hover:text-black"
                      >
                        Live →
                      </a>
                    )}

                    {p.githubURL && (
                      <a
                        href={p.githubURL}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-zinc-700 hover:text-black"
                      >
                        Code →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

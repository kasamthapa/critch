import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getProjects } from "../api/project.api";
import { type Pagination, type ProjectSummary } from "../types/project.types";
import { useAuth } from "../hooks/useAuth";

export function Home() {
  const [projects, setProjects] = useState<Array<ProjectSummary>>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [tags, setTags] = useState<Array<string>>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [pagination, setPaginaton] = useState<Pagination>();
  const [cursor, setCursor] = useState<string | undefined>();

  const [flashMessage, setFlashMessage] = useState(
    location.state?.message || "",
  );

  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search") || "";

  function handleProjectClick(id: number) {
    navigate(`/projects/${id}`);
  }

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage("");
        window.history.replaceState({}, document.title);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);

      try {
        const response = await getProjects(selectedTag, cursor, searchValue);
        if (cursor) {
          setProjects((prev) => [...prev, ...response.data.projects]);
        } else {
          setProjects(response.data.projects);
        }

        setPaginaton(response.data.pagination);
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
  }, [selectedTag, cursor, searchValue]);

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
        <div className="relative mb-8">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-zinc-500 font-medium">
                Browse Projects
              </p>

              <div className="relative w-full md:w-72">
                {/* Trigger */}
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition text-left
          ${
            isOpen
              ? "border-black bg-white shadow-sm"
              : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
          }`}
                >
                  <span
                    className={`font-medium ${
                      selectedTag ? "text-zinc-800" : "text-zinc-500"
                    }`}
                  >
                    {selectedTag || "All projects"}
                  </span>

                  <span
                    className={`text-sm transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* Dropdown */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* All Projects */}
                    <button
                      onClick={() => {
                        setSelectedTag("");
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition border-b border-zinc-100
              ${
                selectedTag === ""
                  ? "bg-black text-white"
                  : "hover:bg-zinc-100 text-zinc-700"
              }`}
                    >
                      All projects
                    </button>

                    {/* Tags */}
                    <div className="max-h-60 overflow-y-auto">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTag(tag);
                            setIsOpen(false);
                            setCursor(undefined);
                          }}
                          className={`w-full px-4 py-3 text-left transition
                  ${
                    selectedTag === tag
                      ? "bg-black text-white"
                      : "hover:bg-zinc-100 text-zinc-700"
                  }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
        {pagination?.hasNextPage && (
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => setCursor(pagination?.nextCursor)}
              className="cursor-pointer border-zinc-500 rounded-xl border px-4 py-3  transition hover:border-zinc-300"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

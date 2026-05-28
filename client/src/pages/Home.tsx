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
    <div className="min-h-screen bg-[#111110] text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Flash */}
        {flashMessage && (
          <div className="mb-6 sm:mb-8 flex items-start gap-3 border-l-2 border-emerald-500 bg-emerald-950/30 px-4 py-3 text-sm sm:text-base text-emerald-400">
            <span className="font-mono text-emerald-500 select-none mt-0.5">
              ✓
            </span>
            {flashMessage}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 sm:mb-8 flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm sm:text-base text-red-400">
            <span className="font-mono text-red-500 select-none mt-0.5">✕</span>
            {error}
          </div>
        )}

        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div>
              <p className="font-mono text-xs sm:text-sm text-zinc-600 tracking-widest uppercase mb-3 sm:mb-4">
                critch / explore
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.0] tracking-tight text-zinc-50">
                Projects
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-500 max-w-sm leading-relaxed">
                Browse and review work from the developer community.
              </p>
            </div>

            {user && (
              <div className="sm:pt-10">
                <button
                  onClick={() => navigate("/projects/new")}
                  className="group inline-flex items-center gap-3 border border-zinc-700 bg-zinc-900 px-4 sm:px-5 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 min-h-[44px]"
                >
                  <span className="font-mono text-zinc-500 group-hover:text-amber-400 transition-colors text-lg leading-none">
                    +
                  </span>
                  New project
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 sm:mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800" />
            {projects.length > 0 && (
              <span className="font-mono text-xs sm:text-sm text-zinc-600">
                {projects.length} result{projects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </header>

        {/* Filter bar */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
            <span className="font-mono text-xs sm:text-sm text-zinc-600 select-none">
              tag:
            </span>

            <div className="relative">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`inline-flex items-center gap-3 border px-3.5 py-2.5 text-sm font-mono transition-all min-h-[44px] ${
                  isOpen
                    ? "border-zinc-400 bg-zinc-800 text-zinc-100"
                    : "border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                }`}
              >
                <span>{selectedTag ? `#${selectedTag}` : "all"}</span>
                <span
                  className={`text-xs text-zinc-600 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 border border-zinc-700 bg-[#161614] shadow-2xl shadow-black/70 z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedTag("");
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left font-mono text-sm transition-colors border-b border-zinc-800 min-h-[44px] ${
                      selectedTag === ""
                        ? "text-amber-400 bg-zinc-800/60"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    all
                  </button>
                  <div className="max-h-60 overflow-y-auto">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTag(tag);
                          setIsOpen(false);
                          setCursor(undefined);
                        }}
                        className={`w-full px-4 py-3 text-left font-mono text-sm transition-colors min-h-[44px] ${
                          selectedTag === tag
                            ? "text-amber-400 bg-zinc-800/60"
                            : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedTag && (
              <button
                onClick={() => setSelectedTag("")}
                className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-mono text-xs sm:text-sm text-amber-400 hover:bg-amber-500/20 transition-colors min-h-[44px]"
              >
                #{selectedTag}
                <span className="text-amber-600 text-xs">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-3 py-16 sm:py-20 text-sm sm:text-base text-zinc-600">
            <span className="font-mono animate-pulse text-lg">···</span>
            <span>fetching projects</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && projects.length === 0 && (
          <div className="border border-zinc-800 border-dashed px-6 sm:px-8 py-16 sm:py-20 text-center">
            <p className="font-mono text-xs sm:text-sm text-zinc-600 mb-2">
              0 results
            </p>
            <p className="text-sm sm:text-base text-zinc-500">
              No projects match this filter.
            </p>
          </div>
        )}

        {/* Project list */}
        <div className="flex flex-col divide-y divide-zinc-800/70">
          {projects.map((p, i) => (
            <div
              key={p.id}
              onClick={() => handleProjectClick(p.id)}
              className="group relative py-6 sm:py-8 cursor-pointer transition-colors duration-150 hover:bg-zinc-900/40 -mx-3 sm:-mx-4 px-3 sm:px-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {/* Thumbnail */}
                <div className="w-full sm:w-44 sm:shrink-0 h-44 sm:h-28 overflow-hidden bg-zinc-800 border border-zinc-700/50">
                  <img
                    src={p.screenshotURL}
                    alt="projectScreenshot"
                    className="w-full h-full object-cover opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.05]"
                  />
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 sm:gap-4">
                    <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                      <span className="font-mono text-xs sm:text-sm text-zinc-700 select-none shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-zinc-100 leading-tight truncate group-hover:text-white transition-colors">
                        {p.title}
                      </h2>
                    </div>
                    <div className="shrink-0 font-mono text-xs sm:text-sm text-zinc-500 flex items-center gap-1.5">
                      <span className="text-amber-500">★</span>
                      <span>{p.avgRating || 0}</span>
                    </div>
                  </div>

                  <p className="mt-1 sm:mt-1.5 font-mono text-xs sm:text-sm text-zinc-600">
                    @{p.author.username}
                  </p>

                  <p className="mt-2 sm:mt-3 text-sm sm:text-base text-zinc-500 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] sm:text-xs text-zinc-500 border border-zinc-800 px-2 sm:px-2.5 py-1 bg-zinc-900/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-5 shrink-0">
                      <span className="font-mono text-xs sm:text-sm text-zinc-600">
                        {p._count.reviews} review
                        {p._count.reviews !== 1 ? "s" : ""}
                      </span>
                      {p.liveURL && (
                        <a
                          href={p.liveURL}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-xs sm:text-sm text-zinc-500 underline underline-offset-4 decoration-zinc-700 hover:text-amber-400 hover:decoration-amber-400/50 transition-colors"
                        >
                          live ↗
                        </a>
                      )}
                      {p.githubURL && (
                        <a
                          href={p.githubURL}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-xs sm:text-sm text-zinc-500 underline underline-offset-4 decoration-zinc-700 hover:text-amber-400 hover:decoration-amber-400/50 transition-colors"
                        >
                          src ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200" />
            </div>
          ))}
        </div>

        {/* Load more */}
        {pagination?.hasNextPage && (
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="font-mono text-xs sm:text-sm text-zinc-600">
              showing {projects.length} project
              {projects.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setCursor(pagination?.nextCursor)}
              className="group inline-flex items-center gap-3 border border-zinc-700 px-4 sm:px-5 py-3 text-sm font-mono text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 min-h-[44px]"
            >
              load more
              <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                ↓
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

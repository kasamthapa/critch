import { useEffect, useState } from "react";
import { DashboardContent, type dashboardPage } from "../types/dashboard.types";
import { getDashboardData } from "../api/dashboard.api";
import { useAuth } from "../hooks/useAuth";
import MyProjects from "../components/MyProjects";
import ReviewsReceived from "../components/ReviewsReceived";
import ReviewsGiven from "../components/ReviewsGiven";
import { FaUser } from "react-icons/fa";
import { useLocation, useSearchParams } from "react-router-dom";

function DashBoard() {
  const [dashboardData, setDashboardData] = useState<dashboardPage>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const location = useLocation();
  const message = location.state?.message;
  const [flashMessage, setFlashMessage] = useState(message || "");

  const [searchParams, setSearchParams] = useSearchParams({
    section: DashboardContent.MY_PROJECT,
  });

  const { user } = useAuth();
  const section = searchParams.get("section");

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      try {
        const response = await getDashboardData();
        setDashboardData(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    makeRequest();
  }, [refreshKey]);

  useEffect(() => {
    setFlashMessage(message);
  }, [message]);

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  return (
    <div className="min-h-screen bg-[#111110] text-zinc-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        {/* Flash */}
        {flashMessage && (
          <div className="mb-8 flex items-start gap-3 border-l-2 border-emerald-500 bg-emerald-950/30 px-5 py-4 text-base text-emerald-400">
            <span className="font-mono text-emerald-500 select-none mt-0.5">
              ✓
            </span>
            {flashMessage}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-3 py-24 text-base text-zinc-600">
            <span className="font-mono animate-pulse text-lg">···</span>
            <span>loading dashboard</span>
          </div>
        )}

        {!isLoading && dashboardData && (
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Sidebar */}
            <aside className="w-full sm:w-64 shrink-0 border border-zinc-800 bg-zinc-900/50">
              {/* User block */}
              <div className="flex items-center gap-4 px-5 py-5 border-b border-zinc-800">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="userProfile"
                    className="w-10 h-10 object-cover border border-zinc-700"
                  />
                ) : (
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <FaUser className="text-zinc-500 text-sm" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-0.5">
                    signed in as
                  </p>
                  <p className="font-mono text-sm text-zinc-300 truncate">
                    @{user?.username}
                  </p>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2.5 flex flex-col gap-1">
                <button
                  onClick={() =>
                    setSearchParams({ section: DashboardContent.MY_PROJECT })
                  }
                  className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors relative ${
                    section === DashboardContent.MY_PROJECT
                      ? "text-zinc-100 bg-zinc-800"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  {section === DashboardContent.MY_PROJECT && (
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />
                  )}
                  my projects
                </button>

                <button
                  onClick={() => setIsDropOpen((prev) => !prev)}
                  className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors flex items-center justify-between ${
                    isDropOpen
                      ? "text-zinc-300"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  reviews
                  <span
                    className={`text-xs text-zinc-600 transition-transform duration-150 ${isDropOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {isDropOpen && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-zinc-800 pl-3">
                    <button
                      onClick={() =>
                        setSearchParams({
                          section: DashboardContent.REVIEWS_RECEIVED,
                        })
                      }
                      className={`w-full text-left px-3 py-2.5 font-mono text-sm transition-colors relative ${
                        section === DashboardContent.REVIEWS_RECEIVED
                          ? "text-zinc-100 bg-zinc-800"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
                      }`}
                    >
                      {section === DashboardContent.REVIEWS_RECEIVED && (
                        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />
                      )}
                      received
                    </button>

                    <button
                      onClick={() =>
                        setSearchParams({
                          section: DashboardContent.REVIEWS_GIVEN,
                        })
                      }
                      className={`w-full text-left px-3 py-2.5 font-mono text-sm transition-colors relative ${
                        section === DashboardContent.REVIEWS_GIVEN
                          ? "text-zinc-100 bg-zinc-800"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
                      }`}
                    >
                      {section === DashboardContent.REVIEWS_GIVEN && (
                        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />
                      )}
                      given
                    </button>
                  </div>
                )}
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              {/* Section heading */}
              <div className="mb-8 flex items-center gap-4">
                <h2 className="font-mono text-sm text-zinc-500 uppercase tracking-widest">
                  {section === DashboardContent.MY_PROJECT && "my projects"}
                  {section === DashboardContent.REVIEWS_RECEIVED &&
                    "reviews / received"}
                  {section === DashboardContent.REVIEWS_GIVEN &&
                    "reviews / given"}
                </h2>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {section === DashboardContent.MY_PROJECT ? (
                <MyProjects
                  projects={dashboardData.projects}
                  setFlashMessage={setFlashMessage}
                  setRefreshKey={setRefreshKey}
                  setError={setError}
                />
              ) : section === DashboardContent.REVIEWS_RECEIVED ? (
                <ReviewsReceived projects={dashboardData.projects} />
              ) : section === DashboardContent.REVIEWS_GIVEN ? (
                <ReviewsGiven reviews={dashboardData.reviewsGiven} />
              ) : (
                ""
              )}

              {error && (
                <div className="mt-6 flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-5 py-4 text-base text-red-400">
                  <span className="font-mono text-red-500 select-none mt-0.5">
                    ✕
                  </span>
                  {error}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoard;

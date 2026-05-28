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
    <div className="min-h-screen bg-zinc-100">
      {/* Flash Message */}
      {flashMessage && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {flashMessage}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center text-zinc-500">
          Loading dashboard...
        </div>
      ) : dashboardData ? (
        <div className="max-w-7xl mx-auto p-6 flex gap-6">
          {/* Sidebar */}
          <div className="w-72 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm h-fit">
            {/* User */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-200">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="userProfile"
                  className="w-14 h-14 rounded-full object-cover border border-zinc-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <FaUser className="text-zinc-500 text-xl" />
                </div>
              )}

              <div>
                <p className="text-sm text-zinc-500">Signed in as</p>

                <p className="font-semibold text-zinc-800">@{user?.username}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 space-y-2">
              <button
                className={`w-full text-left px-4 py-3 rounded-xl transition ${
                  section === DashboardContent.MY_PROJECT
                    ? "bg-black text-white"
                    : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                }`}
                onClick={() =>
                  setSearchParams({
                    section: DashboardContent.MY_PROJECT,
                  })
                }
              >
                My Projects
              </button>

              <button
                className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50 text-zinc-700 hover:bg-zinc-100 transition"
                onClick={() => setIsDropOpen((prev) => !prev)}
              >
                Reviews
              </button>

              {isDropOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  <button
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition ${
                      section === DashboardContent.REVIEWS_RECEIVED
                        ? "bg-black text-white"
                        : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                    }`}
                    onClick={() =>
                      setSearchParams({
                        section: DashboardContent.REVIEWS_RECEIVED,
                      })
                    }
                  >
                    Received
                  </button>

                  <button
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition ${
                      section === DashboardContent.REVIEWS_GIVEN
                        ? "bg-black text-white"
                        : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                    }`}
                    onClick={() =>
                      setSearchParams({
                        section: DashboardContent.REVIEWS_GIVEN,
                      })
                    }
                  >
                    Given
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
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

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default DashBoard;

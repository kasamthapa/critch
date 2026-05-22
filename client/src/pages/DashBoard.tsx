import { useEffect, useState } from "react";
import {
  DashboardContent,
  type DashBoardContent,
  type dashboardPage,
} from "../types/dashboard.types";
import { getDashboardData } from "../api/dashboard.api";
import { useAuth } from "../hooks/useAuth";
import MyProjects from "../components/MyProjects";
import ReviewsReceived from "../components/ReviewsReceived";
import ReviewsGiven from "../components/ReviewsGiven";
import { FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function DashBoard() {
  const [dashboardData, setDashboardData] = useState<dashboardPage>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dashboardContent, setDashboardContent] = useState<DashBoardContent>(
    DashboardContent.MY_PROJECT,
  );
  const location = useLocation();
  const message = location.state?.message;
  const [flashMessage, setFlashMessage] = useState(message || "");
  const { user } = useAuth();
  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      try {
        const response = await getDashboardData();
        setDashboardData(response.data);
        setIsLoading(false);
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
    // 1. Change to min-h-screen to cover the full viewport height
    <div className="min-h-screen flex flex-col">
      <p className="z-10 text-green-400 text-center">{flashMessage}</p>
      {isLoading ? (
        "Loading..."
      ) : dashboardData ? (
        // 2. Cleaned up the broken h-[] class and made the layout stretch
        <div className="flex flex-1 items-stretch">
          {/* sidebar */}
          {/* 3. Removed h-96, added min-h-full (or let flex-1 on the child take over) */}
          <div className="border-r-2 border-black min-h-full w-64 p-4">
            <div className="flex items-center  w-full h-fit border-2 border-black rounded  mb-6">
              {user?.avatarUrl ? (
                <img
                  src={user?.avatarUrl}
                  alt="userProfile"
                  className="w-14 h-14 rounded-full mt-2 mr-2"
                />
              ) : (
                <FaUser className="w-20 h-20 rounded-full  p-2 border-black border-2 m-1" />
              )}
              <p className="font-bold">@{user?.username}</p>
            </div>
            <hr className="border-t-[3px] border-black mb-6 w-full" />

            <div className="flex flex-col m-2 w-full ">
              <button
                className=" h-14 border-2 border-black rounded mb-2"
                onClick={() => setDashboardContent(DashboardContent.MY_PROJECT)}
              >
                My Projects
              </button>
              <button
                className=" h-14 border-2 border-black rounded"
                onClick={() => setIsDropOpen((prev) => !prev)}
              >
                Reviews
              </button>
              {isDropOpen && (
                <div className="flex flex-col ml-20 gap-1 mt-2">
                  <button
                    className="h-10 w-[140px] border-2 border-black rounded"
                    onClick={() =>
                      setDashboardContent(DashboardContent.REVIEWS_RECEIVED)
                    }
                  >
                    Received
                  </button>
                  <button
                    className=" h-10 w-[140px] border-2 border-black rounded"
                    onClick={() =>
                      setDashboardContent(DashboardContent.REVIEWS_GIVEN)
                    }
                  >
                    Given
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* content page */}
          {/* 4. Added flex-1 and padding so the layout splits cleanly next to the sidebar */}
          <div className="flex-1 p-6">
            {dashboardContent == DashboardContent.MY_PROJECT ? (
              <MyProjects
                projects={dashboardData.projects}
                setFlashMessage={setFlashMessage}
                setRefreshKey={setRefreshKey}
                setError={setError}
              />
            ) : dashboardContent == DashboardContent.REVIEWS_RECEIVED ? (
              <ReviewsReceived projects={dashboardData.projects} />
            ) : dashboardContent == DashboardContent.REVIEWS_GIVEN ? (
              <ReviewsGiven reviews={dashboardData.reviewsGiven} />
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      {error}
    </div>
  );
}

export default DashBoard;

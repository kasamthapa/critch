import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfile } from "../api/user.api";
import type { User } from "../types/user.types";

function UserProfile() {
  const [userProfile, setUserProfile] = useState<User>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { username } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      try {
        if (!username) {
          setError("username undefined!!");
          return;
        }
        const response = await getUserProfile(username);
        setUserProfile(response.data);
        setIsLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    makeRequest();
  }, [username]);

  function handleProjectClick(id: number): void {
    navigate(`/projects/${id}`);
  }

  return (
    <div className=" min-h-screen flex  justify-center items-center">
      {isLoading
        ? "Loading...."
        : userProfile && (
            <div className="m-5  w-full max-w-2xl ">
              <h1 className="text-3xl text-center mb-3 font-bold">
                UserProfile
              </h1>
              <div className="flex w-full border-2 border-black rounded mb-3">
                <div className="userInfo">
                  <img src={userProfile.avatarUrl} alt="userProfile" />
                  <span>upload Avatar</span>
                </div>
                <div>
                  <p>{userProfile.username}</p>
                </div>
              </div>
              <div className="bio w-full border-2 border-black rounded mb-3">
                <p>{userProfile.bio}</p>
              </div>
              <div className="reputation w-full border-2 border-black rounded font-extrabold mb-3 text-red-600">
                <p>ReputationScore:{userProfile.reputationScore}</p>
              </div>
              <div className="reviews w-full border-2 border-black rounded mb-3">
                <p className="font-bold border-b-2 border-black">Reviews</p>
                <p>Received:{userProfile.reviewCount}</p>
                <p>Given:{userProfile?.reviewGivenCount}</p>
              </div>

              <div>
                <p className="font-bold border-b-2 mb-3 ">Projects</p>
                {userProfile.projects.map((p) => (
                  <div
                    key={p.id}
                    className="w-full border-2 border-black rounded flex justify-between mb-2"
                  >
                    <div>
                      {" "}
                      <p>{p.title}</p>
                      <p>AverageRating:{p.avgRating}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleProjectClick(p.id)}
                        className="border-black border-2 cursor m-1 rounded p-1"
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      {error}
    </div>
  );
}

export default UserProfile;

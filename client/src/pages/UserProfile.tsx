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
    <div>
      {isLoading
        ? "Loading...."
        : userProfile && (
            <div>
              <div>
                <div className="userInfo">
                  <img src={userProfile.avatarUrl} alt="userProfile" />
                  <span>upload Avatar</span>
                </div>
                <div>
                  <p>{userProfile.username}</p>
                </div>
              </div>
              <div className="bio">
                <p>{userProfile.bio}</p>
              </div>
              <div>
                <p>ReputationScore:{userProfile.reputationScore}</p>
                <div className="reviews">
                  <p>Reviews</p>
                  <p>Received:{userProfile.reviewCount}</p>
                  <p>Given:{userProfile?.reviewGivenCount}</p>
                </div>
              </div>
              <div>
                <p>Projects</p>
                {userProfile.projects.map((p) => (
                  <div key={p.id}>
                    <p>{p.title}</p>
                    <p>AverageRating:{p.avgRating}</p>
                    <button onClick={() => handleProjectClick(p.id)}>
                      View Project
                    </button>
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

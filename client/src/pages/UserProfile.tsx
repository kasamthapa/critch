import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { bioUpdate, getUserProfile } from "../api/user.api";

import { FaCamera } from "react-icons/fa";

import { FaUser } from "react-icons/fa6";

import type { User } from "../types/user.types";

import { useAuth } from "../hooks/useAuth";

import AvatarUpload from "../components/AvatarUpload";

function UserProfile() {
  const [userProfile, setUserProfile] = useState<User>();

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAvatarOpen, setIsAvatarOpen] = useState<boolean>(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [bio, setBio] = useState("");

  const { username } = useParams();

  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);

      try {
        if (!username) {
          setError("Username undefined");

          return;
        }

        const response = await getUserProfile(username);

        setUserProfile(response.data);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };

    makeRequest();
  }, [username, refreshKey]);

  useEffect(() => {
    if (userProfile) {
      setBio(userProfile.bio);
    }
  }, [userProfile]);

  function handleProjectClick(id: number) {
    navigate(`/projects/${id}`);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setBio(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await bioUpdate(bio);

      setRefreshKey((prev) => prev + 1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      {/* Avatar Modal */}
      {isAvatarOpen && (
        <AvatarUpload
          setIsOpen={setIsAvatarOpen}
          setRefreshKey={setRefreshKey}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20 text-zinc-500">
            Loading profile...
          </div>
        ) : (
          userProfile && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative w-fit">
                    {userProfile.avatarURL ? (
                      <img
                        src={userProfile.avatarURL}
                        alt="userProfile"
                        className="w-28 h-28 rounded-full object-cover border-4 border-zinc-100"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full border-4 border-zinc-100 bg-zinc-200 flex items-center justify-center">
                        <FaUser className="text-5xl text-zinc-500" />
                      </div>
                    )}

                    {user?.username === username && (
                      <button
                        onClick={() => setIsAvatarOpen(true)}
                        className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition"
                      >
                        <FaCamera />
                      </button>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-zinc-800">
                      @{userProfile.username}
                    </h1>

                    <p className="text-zinc-500 mt-2">Developer Profile</p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mt-6">
                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 min-w-[140px]">
                        <p className="text-sm text-zinc-500">Reputation</p>

                        <p className="text-2xl font-bold text-zinc-800">
                          {userProfile.reputationScore}
                        </p>
                      </div>

                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 min-w-[140px]">
                        <p className="text-sm text-zinc-500">
                          Reviews Received
                        </p>

                        <p className="text-2xl font-bold text-zinc-800">
                          {userProfile.reviewCount}
                        </p>
                      </div>

                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 min-w-[140px]">
                        <p className="text-sm text-zinc-500">Reviews Given</p>

                        <p className="text-2xl font-bold text-zinc-800">
                          {userProfile.reviewGivenCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-zinc-800">Bio</h2>

                  {userProfile.bio !== bio && user?.username === username && (
                    <button
                      type="submit"
                      form="bioForm"
                      className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
                    >
                      Save
                    </button>
                  )}
                </div>

                {user?.username === username ? (
                  <form id="bioForm" onSubmit={handleSubmit}>
                    <textarea
                      name="bio"
                      value={bio}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Write something about yourself..."
                      className="w-full border border-zinc-200 rounded-2xl px-4 py-4 bg-zinc-50 outline-none resize-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                ) : (
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 min-h-[120px]">
                    {bio ? (
                      <p className="text-zinc-700 leading-relaxed">{bio}</p>
                    ) : (
                      <p className="text-zinc-400">No bio added yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-zinc-800">Projects</h2>

                  <span className="text-zinc-500">
                    {userProfile.projects.length} Projects
                  </span>
                </div>

                <div className="space-y-4">
                  {userProfile.projects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-800">
                          {p.title}
                        </h3>

                        <p className="text-zinc-500 mt-2">
                          Average Rating: {p.avgRating}
                        </p>
                      </div>

                      <button
                        onClick={() => handleProjectClick(p.id)}
                        className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
                      >
                        View Project
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                  {error}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default UserProfile;

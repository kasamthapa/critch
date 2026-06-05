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
    if (userProfile) setBio(userProfile.bio);
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
    <div className="min-h-screen bg-[#111110] text-zinc-300">
      {/* Avatar Modal */}
      {isAvatarOpen && (
        <AvatarUpload
          setIsOpen={setIsAvatarOpen}
          setRefreshKey={setRefreshKey}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-3 py-24 text-sm sm:text-base text-zinc-600">
            <span className="font-mono animate-pulse text-lg">···</span>
            <span>loading profile</span>
          </div>
        )}
        {!isLoading && !userProfile && error && (
          <div className="max-w-6xl mx-auto px-4 py-24 text-center">
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-4">
              404
            </p>
            <h1 className="text-3xl font-bold text-zinc-100 mb-3">
              user not found
            </h1>
            <button
              onClick={() => navigate("/")}
              className="border border-zinc-700 px-5 py-3 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all"
            >
              back to home
            </button>
          </div>
        )}
        {!isLoading && userProfile && (
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* ── Profile header ── */}
            <div className="border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
                {/* Avatar */}
                <div className="relative w-fit shrink-0">
                  {userProfile.avatarURL ? (
                    <img
                      src={userProfile.avatarURL}
                      alt="userProfile"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-zinc-700"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center">
                      <FaUser className="text-3xl sm:text-4xl text-zinc-600" />
                    </div>
                  )}

                  {user?.username === username && (
                    <button
                      onClick={() => setIsAvatarOpen(true)}
                      className="absolute bottom-0 right-0 w-8 h-8 border border-zinc-600 bg-zinc-800 text-zinc-300 flex items-center justify-center hover:border-zinc-400 hover:text-zinc-100 transition-all"
                    >
                      <FaCamera className="text-xs" />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs sm:text-sm text-zinc-600 uppercase tracking-widest mb-2">
                    developer profile
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-50">
                    @{userProfile.username}
                  </h1>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
                    <div className="border border-zinc-800 bg-zinc-900/60 px-3 sm:px-5 py-3 sm:py-4">
                      <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-1.5">
                        reputation
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-zinc-100">
                        {userProfile.reputationScore}
                      </p>
                    </div>
                    <div className="border border-zinc-800 bg-zinc-900/60 px-3 sm:px-5 py-3 sm:py-4">
                      <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-1.5">
                        received
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-zinc-100">
                        {userProfile.reviewCount}
                      </p>
                    </div>
                    <div className="border border-zinc-800 bg-zinc-900/60 px-3 sm:px-5 py-3 sm:py-4">
                      <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-1.5">
                        given
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-zinc-100">
                        {userProfile.reviewGivenCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bio ── */}
            <div className="border border-zinc-800 bg-zinc-900/30 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
                    Bio
                  </h2>
                  <div className="h-px w-12 bg-zinc-800" />
                </div>

                {userProfile.bio !== bio && user?.username === username && (
                  <button
                    type="submit"
                    form="bioForm"
                    className="px-4 py-2 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 transition-all min-h-[44px]"
                  >
                    save
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
                    className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none resize-none focus:border-zinc-400 transition-colors leading-relaxed"
                  />
                </form>
              ) : (
                <div className="border-l border-zinc-700 pl-4 sm:pl-5 min-h-[80px] flex items-start py-1">
                  {bio ? (
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                      {bio}
                    </p>
                  ) : (
                    <p className="font-mono text-sm text-zinc-600">
                      no bio added yet.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Projects ── */}
            <div className="border border-zinc-800 bg-zinc-900/30 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
                    Projects
                  </h2>
                  <div className="h-px w-12 bg-zinc-800" />
                </div>
                <span className="font-mono text-xs sm:text-sm text-zinc-600">
                  {userProfile.projects.length} total
                </span>
              </div>

              <div className="flex flex-col divide-y divide-zinc-800/70">
                {userProfile.projects.map((p, i) => (
                  <div
                    key={p.id}
                    className="group relative py-5 sm:py-6 -mx-3 sm:-mx-4 px-3 sm:px-4 transition-colors hover:bg-zinc-900/40"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200" />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                        <span className="font-mono text-xs sm:text-sm text-zinc-700 shrink-0 select-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 truncate">
                            {p.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-amber-500 text-sm">★</span>
                            <span className="font-mono text-xs sm:text-sm text-zinc-500">
                              {p.avgRating} avg
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleProjectClick(p.id)}
                        className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-mono text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all min-h-[44px]"
                      >
                        view ↗
                      </button>
                    </div>
                  </div>
                ))}

                {userProfile.projects.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="font-mono text-xs sm:text-sm text-zinc-600 mb-1">
                      0 projects
                    </p>
                    <p className="text-sm text-zinc-500">
                      No projects uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm sm:text-base text-red-400">
                <span className="font-mono text-red-500 select-none mt-0.5">
                  ✕
                </span>
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

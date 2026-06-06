import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ProjectDetail } from "../types/project.types";
import { deleteProject, getOneProject } from "../api/project.api";
import type { CommentType } from "../types/comment.types";
import Comment from "../components/Comment";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../hooks/useAuth";
import CommentForm from "../components/CommentForm";
import { FaRegComment, FaUser } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

function Project() {
  const [project, setProject] = useState<ProjectDetail>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isCreateReview, setIsCreateReview] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [openComments, setOpenComments] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const [flashMessage, setFlashMessage] = useState(message || "");
  const { id } = useParams();
  const { user } = useAuth();

  async function handleDelete() {
    if (!project || project.id == undefined) {
      setError("projectId or project undefined");
      return;
    }
    try {
      const response = await deleteProject(project.id);
      navigate("/", { state: { message: response.message } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message);
    }
  }

  useEffect(() => {
    setFlashMessage(message);
  }, [message]);

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  useEffect(() => {
    const makeRequest = async () => {
      if (!id) {
        setError("Project Id undefined");
        return;
      }
      setIsLoading(true);
      try {
        const response = await getOneProject(id);
        setProject(response.data);
        const TopLevelComments = response.data.comments.filter(
          (c) => c.parentId == null,
        );
        function buildCommentTree(cmts: CommentType[] | undefined) {
          cmts?.forEach((cm: CommentType) => {
            response.data.comments.forEach((c) => {
              if (cm.id === c.parentId) {
                cm.replies = cm.replies ? [...cm.replies, c] : [c];
                buildCommentTree(cm.replies);
              }
            });
          });
        }
        buildCommentTree(TopLevelComments);
        setComments(TopLevelComments);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    makeRequest();
  }, [id, refreshKey]);

  const ScoreCard = ({
    label,
    value,
  }: {
    label: string;
    value: number | string;
  }) => (
    <div className="border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl font-bold text-zinc-100">
          {value}
        </span>
        <span className="font-mono text-sm text-zinc-600">/5</span>
      </div>
      <div className="mt-2.5 h-0.5 bg-zinc-800">
        <div
          className="h-0.5 bg-amber-500"
          style={{ width: `${(Number(value) / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111110] text-zinc-300">
      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-3 justify-center py-24 text-base text-zinc-600">
          <span className="font-mono animate-pulse text-lg">···</span>
          <span>loading project</span>
        </div>
      )}
      {!isLoading && !project && error && (
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-4">
            404
          </p>
          <h1 className="text-3xl font-bold text-zinc-100 mb-3">
            Project not found
          </h1>
          <p className="text-zinc-500 mb-8">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="border border-zinc-700 px-5 py-3 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all"
          >
            back to projects
          </button>
        </div>
      )}
      {!isLoading && project && (
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
          style={{ pointerEvents: isSubmitting ? "none" : "auto" }}
        >
          {/* Flash */}
          {flashMessage && (
            <div className="mb-6 sm:mb-8 flex items-start gap-3 border-l-2 border-emerald-500 bg-emerald-950/30 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-emerald-400">
              <span className="font-mono text-emerald-500 select-none mt-0.5">
                ✓
              </span>
              {flashMessage}
            </div>
          )}

          {/* Delete Dialog */}
          {isDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-4 sm:pb-0">
              <div
                role="alertdialog"
                className="w-full sm:w-auto sm:max-w-md bg-[#161614] border border-zinc-700 p-6 sm:p-8 shadow-2xl shadow-black/60"
              >
                <div className="mb-5 sm:mb-6">
                  <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-3">
                    confirm action
                  </p>
                  <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                    Delete project?
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-zinc-500 leading-relaxed">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
                <div className="h-px bg-zinc-800 mb-5 sm:mb-6" />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-5 py-3 border border-zinc-700 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all min-h-[44px]"
                  >
                    cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-5 py-3 border border-red-500/50 bg-red-500/10 font-mono text-sm text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all min-h-[44px]"
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hero image */}
          <div className="w-full h-[220px] sm:h-[340px] lg:h-[460px] overflow-hidden border border-zinc-800 bg-zinc-800">
            <img
              src={project.screenshotURL}
              alt="projectScreenshot"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Project header */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={project.author.avatarURL}
                  alt="userProfile"
                  className="w-9 h-9 object-cover border border-zinc-700 shrink-0"
                />
                <div>
                  <p className="font-mono text-sm text-zinc-300">
                    @{project.author.username}
                  </p>
                  <p className="font-mono text-xs text-zinc-600">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-50 leading-tight">
                {project.title}
              </h1>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-500 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2.5 py-1.5 bg-zinc-900/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Owner menu */}
            {user?.id === project.userId && (
              <div className="relative shrink-0 self-start">
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="w-11 h-11 border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all"
                >
                  <SlOptions />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 border border-zinc-700 bg-[#161614] shadow-2xl shadow-black/60 z-20 overflow-hidden">
                    <button
                      className="w-full text-left px-4 py-3.5 font-mono text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors min-h-[44px]"
                      onClick={() =>
                        navigate(`/projects/edit/${project.id}`, {
                          state: {
                            title: project.title,
                            description: project.description,
                            liveURL: project.liveURL,
                            githubURL: project.githubURL,
                            tags: project.tags.join(","),
                            from: `//projects/${project.id}`,
                          },
                        })
                      }
                    >
                      edit
                    </button>
                    <button
                      className="w-full text-left px-4 py-3.5 font-mono text-sm text-red-400 hover:bg-red-500/10 transition-colors min-h-[44px]"
                      onClick={() => {
                        setIsDialogOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats + Links */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="border border-zinc-800 bg-zinc-900/40 px-4 sm:px-5 py-4">
                <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
                  Reviews
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-100">
                  {project._count.reviews}
                </p>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/40 px-4 sm:px-5 py-4">
                <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
                  Avg Rating
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-amber-500 text-lg sm:text-xl">★</span>
                  <span className="text-2xl sm:text-3xl font-bold text-zinc-100">
                    {project.avgRating}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={project.liveURL}
                target="_blank"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-zinc-600 bg-zinc-800 px-5 py-3 font-mono text-sm text-zinc-200 hover:border-zinc-400 hover:text-white hover:bg-zinc-700 transition-all min-h-[44px]"
              >
                live ↗
              </a>
              <a
                href={project.githubURL}
                target="_blank"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-zinc-700 px-5 py-3 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all min-h-[44px]"
              >
                src ↗
              </a>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 h-px bg-zinc-800" />

          {/* Reviews section */}
          <div className="mt-8 sm:mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                Reviews
              </h2>
              <button
                onClick={() => setIsCreateReview((prev) => !prev)}
                className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-mono text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all min-h-[44px]"
              >
                {isCreateReview ? "cancel" : "+ write review"}
              </button>
            </div>

            {user?.id === project.userId ? (
              <div className="mb-6 flex items-start gap-3 border-l-2 border-zinc-700 px-4 py-3 text-sm text-zinc-500">
                <span className="font-mono select-none">—</span>
                You cannot review your own project
              </div>
            ) : project.reviews.some((r) => r.userId === user?.id) ? (
              <div className="mb-6 flex items-start gap-3 border-l-2 border-zinc-700 px-4 py-3 text-sm text-zinc-500">
                <span className="font-mono select-none">—</span>
                You have already reviewed this project
              </div>
            ) : !user ? (
              <div className="mb-6 flex items-start gap-3 border-l-2 border-zinc-700 px-4 py-3 text-sm text-zinc-500">
                <span className="font-mono select-none">—</span>
                Sign in to leave a review or comment
              </div>
            ) : null}

            {isCreateReview && (
              <div className="mb-8 border border-zinc-800 p-4 sm:p-6 bg-zinc-900/40">
                <ReviewForm
                  setIsCreateReview={setIsCreateReview}
                  setRefreshKey={setRefreshKey}
                  setFlashMessage={setFlashMessage}
                />
              </div>
            )}

            <div className="flex flex-col divide-y divide-zinc-800/70">
              {project.reviews.map((r) => (
                <div key={r.id} className="py-6 sm:py-7">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    {r.user.avatarURL ? (
                      <img
                        src={r.user.avatarURL}
                        alt="userProfile"
                        className="w-9 h-9 object-cover border border-zinc-700 shrink-0"
                      />
                    ) : (
                      <FaUser className="w-9 h-9 object-cover border border-zinc-700 shrink-0" />
                    )}
                    <div>
                      <p className="font-mono text-sm text-zinc-300">
                        @{r.user.username}
                      </p>
                      <p className="font-mono text-xs text-zinc-600">
                        reviewer
                      </p>
                    </div>
                  </div>

                  {r.comment && (
                    <div className="mb-5 border-l border-zinc-700 pl-4 sm:pl-5">
                      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                    <ScoreCard label="Code" value={r.codeQuality} />
                    <ScoreCard label="Idea" value={r.ideaScore} />
                    <ScoreCard label="Docs" value={r.documentation} />
                    <ScoreCard label="UI" value={r.uiDesign} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 h-px bg-zinc-800" />

          {/* Comments section */}
          <div className="mt-8 sm:mt-10 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                Comments
              </h2>
              <button
                onClick={() => setOpenComments((prev) => !prev)}
                className="w-11 h-11 border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all"
              >
                <FaRegComment />
              </button>
            </div>

            {!openComments && comments.length > 0 && (
              <div className="border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  {comments[0].user.avatarURL ? (
                    <img
                      src={comments[0].user.avatarURL}
                      alt="userProfile"
                      className="w-9 h-9 object-cover border border-zinc-700 shrink-0"
                    />
                  ) : (
                    <FaUser className="w-9 h-9 object-cover border border-zinc-700 shrink-0" />
                  )}
                  <p className="font-mono text-sm text-zinc-300">
                    @{comments[0].user.username}
                  </p>
                </div>
                <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
                  {comments[0].content}
                </p>
              </div>
            )}

            {openComments && (
              <div className="flex flex-col gap-4">
                {comments?.map((c: CommentType) => (
                  <Comment
                    setRefreshKey={setRefreshKey}
                    key={c.id}
                    cId={c.id}
                    author={c.user}
                    projectId={c.projectId}
                    isReply={false}
                    content={c.content}
                    replies={c.replies}
                  />
                ))}

                {user && (
                  <div className="pt-5 sm:pt-6 border-t border-zinc-800">
                    <CommentForm
                      projectId={project.id}
                      setRefreshKey={setRefreshKey}
                      setIsSubmitting={setIsSubmitting}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 sm:mt-8 flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-red-400">
              <span className="font-mono text-red-500 select-none mt-0.5">
                ✕
              </span>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Project;

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ProjectDetail } from "../types/project.types";
import { deleteProject, getOneProject } from "../api/project.api";
import type { CommentType } from "../types/comment.types";
import Comment from "../components/Comment";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../hooks/useAuth";
import CommentForm from "../components/CommentForm";
import { FaRegComment } from "react-icons/fa";
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
      navigate("/", {
        state: { message: response.message },
      });
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
      const timer = setTimeout(() => {
        setFlashMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);
  useEffect(() => {
    const makeRequest = async () => {
      if (!id) {
        setError("Project Id undefined ");
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
  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      {isLoading ? (
        <div className="flex items-center justify-center text-zinc-500 py-20">
          Loading project...
        </div>
      ) : (
        project && (
          <div
            className="max-w-5xl mx-auto"
            style={{
              pointerEvents: isSubmitting ? "none" : "auto",
            }}
          >
            {/* Flash Message */}
            {flashMessage && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                {flashMessage}
              </div>
            )}

            {/* Project Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Image */}
              <div className="h-[400px] bg-zinc-200 overflow-hidden">
                <img
                  src={project.screenshotURL}
                  alt="projectScreenshot"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">
                      Posted on {project.created_at}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <img
                        src={project.author.avatarURL}
                        alt="userProfile"
                        className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                      />

                      <div>
                        <p className="font-semibold text-zinc-800">
                          {project.author.username}
                        </p>

                        <p className="text-sm text-zinc-500">Project Author</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="relative">
                    {user?.id === project.userId && (
                      <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center hover:bg-zinc-200 transition"
                      >
                        <SlOptions />
                      </button>
                    )}

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden z-20">
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-zinc-50 text-zinc-700 transition"
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
                          Edit
                        </button>

                        <button
                          className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-500 transition"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete Dialog */}
                {isDialogOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div
                      role="alertdialog"
                      className="w-[90%] max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-xl"
                    >
                      <h2 className="text-2xl font-semibold text-zinc-800 mb-2">
                        Delete Project
                      </h2>

                      <p className="text-zinc-500 mb-6">
                        Are you sure you want to delete this project?
                      </p>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setIsDialogOpen(false)}
                          className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="mt-8">
                  <h1 className="text-4xl font-bold text-zinc-800">
                    {project.title}
                  </h1>

                  <p className="text-zinc-600 leading-relaxed mt-4">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-sm text-zinc-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
                    <p className="text-sm text-zinc-500">Reviews</p>

                    <p className="text-3xl font-bold text-zinc-800 mt-1">
                      {project._count.reviews}
                    </p>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
                    <p className="text-sm text-zinc-500">Average Rating</p>

                    <p className="text-3xl font-bold text-zinc-800 mt-1">
                      ⭐ {project.avgRating}
                    </p>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <a
                    href={project.liveURL}
                    target="_blank"
                    className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
                  >
                    Live Preview
                  </a>

                  <a
                    href={project.githubURL}
                    target="_blank"
                    className="px-5 py-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-6 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-zinc-800">
                  Reviews
                </h2>

                <button
                  onClick={() => setIsCreateReview((prev) => !prev)}
                  className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
                >
                  Create Review
                </button>
              </div>

              <div className="space-y-4">
                {project.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <img
                        src={r.user.avatarURL}
                        alt="userProfile"
                        className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                      />

                      <div>
                        <p className="font-semibold text-zinc-800">
                          {r.user.username}
                        </p>

                        <p className="text-sm text-zinc-500">Reviewer</p>
                      </div>
                    </div>

                    <p className="text-zinc-700 mb-5">{r.comment}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white border border-zinc-200 rounded-xl p-4">
                        <p className="text-sm text-zinc-500">Code</p>

                        <p className="text-xl font-bold text-zinc-800">
                          {r.codeQuality}/5
                        </p>
                      </div>

                      <div className="bg-white border border-zinc-200 rounded-xl p-4">
                        <p className="text-sm text-zinc-500">Idea</p>

                        <p className="text-xl font-bold text-zinc-800">
                          {r.ideaScore}/5
                        </p>
                      </div>

                      <div className="bg-white border border-zinc-200 rounded-xl p-4">
                        <p className="text-sm text-zinc-500">Docs</p>

                        <p className="text-xl font-bold text-zinc-800">
                          {r.documentation}/5
                        </p>
                      </div>

                      <div className="bg-white border border-zinc-200 rounded-xl p-4">
                        <p className="text-sm text-zinc-500">UI</p>

                        <p className="text-xl font-bold text-zinc-800">
                          {r.uiDesign}/5
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Review Conditions */}
            <div className="mt-6">
              {user?.id === project.userId ? (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-500">
                  You cannot review your own project
                </div>
              ) : project.reviews.some((r) => r.userId === user?.id) ? (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-500">
                  You have already reviewed this project
                </div>
              ) : !user ? (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-500">
                  Login to review and comment on project
                </div>
              ) : (
                ""
              )}
            </div>

            {/* Review Form */}
            {isCreateReview && (
              <div className="mt-6">
                <ReviewForm
                  setIsCreateReview={setIsCreateReview}
                  setRefreshKey={setRefreshKey}
                  setFlashMessage={setFlashMessage}
                />
              </div>
            )}
            {/* Comments */}
            <div className="mt-6 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-zinc-800">
                  Comments
                </h2>

                <button
                  onClick={() => setOpenComments((prev) => !prev)}
                  className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center hover:bg-zinc-200 transition"
                >
                  <FaRegComment />
                </button>
              </div>

              {!openComments && comments.length > 0 && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={comments[0].user.avatarURL}
                      alt="userProfile"
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />

                    <p className="font-semibold text-zinc-800">
                      {comments[0].user.username}
                    </p>
                  </div>

                  <p className="text-zinc-700">{comments[0].content}</p>
                </div>
              )}

              {openComments && (
                <div className="space-y-4">
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
                    <div className="pt-4 border-t border-zinc-200">
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
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                {error}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default Project;

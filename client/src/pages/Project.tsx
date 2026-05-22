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
    <>
      {isLoading
        ? "Loading....."
        : project && (
            <div
              style={{
                pointerEvents: isSubmitting ? "none" : "auto",
                margin: "4px",
              }}
            >
              <p>{flashMessage}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: 12 }}>
                    Posted on:{project.created_at}
                  </span>
                  <p>
                    <img src={project.author.avatarURL} alt="userProfile" />:
                    {project.author.username}
                  </p>
                </div>
                <div>
                  {user?.id === project.userId && (
                    <button onClick={() => setIsMenuOpen((prev) => !prev)}>
                      <SlOptions />
                    </button>
                  )}
                  {isMenuOpen && (
                    <div>
                      <p
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
                      </p>
                      <p onClick={() => setIsDialogOpen(true)}>Delete</p>
                    </div>
                  )}
                </div>
              </div>
              {isDialogOpen && (
                <div role="alertdialog" style={{ zIndex: "100" }}>
                  <p>Are you sure?</p>
                  <button onClick={handleDelete}>Confirm</button>&nbsp;
                  <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
                </div>
              )}
              <h3>{project.title} </h3>
              <p>{project.description}</p>
              <a href={project.liveURL} target="_blank">
                Try live
              </a>
              <br />
              <a href={project.githubURL} target="_blank">
                View Code
              </a>
              <p>
                {project.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </p>
              <img
                src={project.screenshotURL}
                alt="projectScreenshot"
                width={100}
                height={100}
              />
              <p>Reviews:{project._count.reviews}</p>
              <p>AverageRating:{project.avgRating}</p>
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {project.reviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "flex",
                      width: "200px",
                      flexDirection: "column",
                      alignItems: "center",
                      border: "2px solid white",
                      borderRadius: "4px",
                    }}
                  >
                    <p>
                      <img src={r.user.avatarURL} alt="userProfile" />
                      &nbsp; {r.user.username}:<span>{r.comment}</span>
                    </p>

                    <div>CodeQuality:{r.codeQuality}/5</div>
                    <div>Idea:{r.ideaScore}/5</div>
                    <div>Documentation:{r.documentation}/5</div>
                    <div>UI Design:{r.uiDesign}/5</div>
                    <br />
                  </div>
                ))}
                <button onClick={() => setOpenComments((prev) => !prev)}>
                  <FaRegComment />
                </button>{" "}
              </div>
              {!openComments && comments.length > 0 && (
                <div style={{ border: "2px solid white", borderRadius: "4px" }}>
                  <p>
                    <img src={comments[0].user.avatarURL} alt="userProfile" />
                    &nbsp; {comments[0].user.username}
                  </p>
                  <p>&nbsp;{comments[0].content}</p>
                </div>
              )}
              {openComments && (
                <div style={{ border: "2px solid white", borderRadius: "4px" }}>
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
                    <CommentForm
                      projectId={project.id}
                      setRefreshKey={setRefreshKey}
                      setIsSubmitting={setIsSubmitting}
                    />
                  )}
                </div>
              )}
              {user?.id === project.userId ? (
                "You cannot review your own project"
              ) : project.reviews.some((r) => r.userId === user?.id) ? (
                "You have already reviewed this project"
              ) : user ? (
                <button onClick={() => setIsCreateReview((prev) => !prev)}>
                  Create Review
                </button>
              ) : (
                "Login to review and comment on project"
              )}{" "}
              {isCreateReview && (
                <ReviewForm
                  setIsCreateReview={setIsCreateReview}
                  setRefreshKey={setRefreshKey}
                  setFlashMessage={setFlashMessage}
                />
              )}
              {error}
            </div>
          )}
    </>
  );
}

export default Project;

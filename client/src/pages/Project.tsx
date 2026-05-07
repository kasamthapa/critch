import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { ProjectDetail } from "../types/project.types";
import { getOneProject } from "../api/project.api";
import type { CommentType } from "../types/comment.types";
import Comment from "../components/Comment";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../hooks/useAuth";
function Project() {
  const [project, setProject] = useState<ProjectDetail>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isCreateReview, setIsCreateReview] = useState<boolean>(false);
  const location = useLocation();
  const message = location.state?.message;
  const [flashMessage, setFlashMessage] = useState(message || "");
  const { id } = useParams();
  const { user } = useAuth();

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
  }, [id, message]);

  return (
    <>
      {isLoading
        ? "Loading....."
        : project && (
            <div>
              <p>{flashMessage}</p>
              <h3>{project.title} </h3>
              <span style={{ fontSize: 12 }}>
                Posted on:{project.created_at}
              </span>
              <p>Author:{project.author.username}</p>
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
              <div>
                {project.reviews.map((r) => (
                  <div key={r.id}>
                    <p>
                      {r.user.username}::
                      <span>{r.comment}</span>
                    </p>

                    <div>
                      CodeQuality:{r.codeQuality}
                      <progress value={r.codeQuality} max={5} />
                    </div>
                    <div>
                      Idea:{r.ideaScore}
                      <progress value={r.ideaScore} max={5} />
                    </div>
                    <div>
                      Documentation:{r.documentation}
                      <progress value={r.documentation} max={5} />
                    </div>
                    <div>
                      UI Design:{r.uiDesign}
                      <progress value={r.uiDesign} max={5} />
                    </div>
                    <br />
                  </div>
                ))}
                Comments: <br />
                {comments?.map((c: CommentType) => (
                  <Comment
                    key={c.id}
                    user={c.user}
                    isReply={false}
                    content={c.content}
                    replies={c.replies}
                  />
                ))}
              </div>
              {user?.id !== project.userId && (
                <button onClick={() => setIsCreateReview((prev) => !prev)}>
                  Create Review
                </button>
              )}{" "}
              {isCreateReview && (
                <ReviewForm setIsCreateReview={setIsCreateReview} />
              )}
              {error}
            </div>
          )}
    </>
  );
}

export default Project;

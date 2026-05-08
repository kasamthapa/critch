import { useState } from "react";
import { createComment } from "../api/project.api";
import type { createCommentRequest } from "../types/comment.types";

function CommentForm({
  projectId,
  setRefreshKey,
  setIsSubmitting,
}: {
  projectId: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContent(e.target.value);
  }
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId) {
      setError("Project Id undefined ");
      return;
    }
    setIsSubmitting(true);
    const payload: createCommentRequest = { content, projectId };
    try {
      await createComment(payload);
      setRefreshKey((prev) => prev + 1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="content" onChange={handleChange} />
        <button type="submit">Comment</button>
      </form>
      {error}
    </div>
  );
}

export default CommentForm;

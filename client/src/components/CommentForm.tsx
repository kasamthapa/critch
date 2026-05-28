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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId) {
      setError("Project Id undefined");
      return;
    }
    setIsSubmitting(true);
    const payload: createCommentRequest = { content, projectId };
    try {
      await createComment(payload);
      setRefreshKey((prev) => prev + 1);
      setContent("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="Write a comment..."
          className="flex-1 border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
        />
        <button
          type="submit"
          disabled={content.length === 0}
          className="w-full sm:w-auto px-5 py-3 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 hover:text-white transition-all min-h-[44px] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-600 disabled:hover:bg-zinc-800"
        >
          comment
        </button>
      </form>

      {error && (
        <div className="mt-3 flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          <span className="font-mono text-red-500 select-none">✕</span>
          {error}
        </div>
      )}
    </div>
  );
}

export default CommentForm;

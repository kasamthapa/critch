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

    const payload: createCommentRequest = {
      content,
      projectId,
    };

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
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input */}
        <input
          type="text"
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="Write a comment..."
          className="w-full border border-zinc-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-black"
        />

        {/* Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={content.length > 0 ? false : true}
            className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
          >
            Comment
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

export default CommentForm;

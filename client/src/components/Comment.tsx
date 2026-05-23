import { useState } from "react";
import type { CommentType, CommentAuthor } from "../types/comment.types";

import { createComment } from "../api/project.api";

import { SlArrowDown } from "react-icons/sl";

import { useAuth } from "../hooks/useAuth";

function Comment({
  author,
  content,
  replies,
  isReply,
  cId,
  projectId,
  setRefreshKey,
}: {
  cId: number;
  author: CommentAuthor;
  content: string;
  projectId: number;

  replies?: CommentType[];
  isReply: boolean;

  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const initialValue = {
    projectId: null,
    content: "",
    parentId: null,
  };

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formValue, setFormValue] = useState(initialValue);

  const [error, setError] = useState("");

  const [seeReplies, setSeeReplies] = useState<boolean>(false);

  const { user } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      ...formValue,
      projectId,
      parentId: cId,
    };

    try {
      await createComment(payload);

      setRefreshKey((prev) => prev + 1);

      setFormValue(initialValue);

      setIsFormOpen(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className={`${isReply ? "ml-10 mt-4" : "mt-4"}`}>
      {/* Comment Card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
        {/* User */}
        <div className="flex items-center gap-3">
          <img
            src={author.avatarURL}
            alt="userProfile"
            className="w-10 h-10 rounded-full object-cover border border-zinc-200"
          />

          <div>
            <p className="font-semibold text-zinc-800">{author.username}</p>

            <p className="text-sm text-zinc-500">Comment</p>
          </div>
        </div>

        {/* Content */}
        <p className="text-zinc-700 leading-relaxed mt-4">{content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-5">
          {!isFormOpen && user && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-sm font-medium text-zinc-600 hover:text-black transition"
            >
              Reply
            </button>
          )}

          {!isFormOpen && isReply === false && (replies?.length ?? 0) > 0 && (
            <button
              onClick={() => setSeeReplies((prev) => !prev)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition"
            >
              <span>
                {seeReplies
                  ? "Hide Replies"
                  : `See Replies (${replies?.length})`}
              </span>

              <SlArrowDown
                className={`transition ${seeReplies ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {/* Reply Form */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <input
              type="text"
              name="content"
              placeholder="Write a reply..."
              onChange={handleChange}
              value={formValue.content}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-black"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
              >
                Reply
              </button>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Replies */}
      {seeReplies && (
        <div className="mt-4 space-y-4">
          {replies?.map((r) => (
            <Comment
              setRefreshKey={setRefreshKey}
              projectId={projectId}
              key={r.id}
              cId={r.id}
              isReply={true}
              author={r.user}
              content={r.content}
              replies={r.replies}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

export default Comment;

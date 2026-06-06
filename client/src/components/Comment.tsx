import { useState } from "react";
import type { CommentType, CommentAuthor } from "../types/comment.types";
import { createComment } from "../api/project.api";
import { SlArrowDown } from "react-icons/sl";
import { useAuth } from "../hooks/useAuth";
import { FaUser } from "react-icons/fa";

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
  const initialValue = { projectId: null, content: "", parentId: null };
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValue, setFormValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [seeReplies, setSeeReplies] = useState<boolean>(false);
  const { user } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...formValue, projectId, parentId: cId };
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
    <div className={`${isReply ? "ml-4 sm:ml-8 mt-3" : "mt-3"}`}>
      {/* Comment card */}
      <div className="border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        {/* Author */}
        <div className="flex items-center gap-3">
          {author.avatarURL ? (
            <img
              src={author.avatarURL}
              alt="userProfile"
              className="w-9 h-9 object-cover border border-zinc-700 shrink-0"
            />
          ) : (
            <FaUser className="w-9 h-9 object-cover border border-zinc-700 shrink-0" />
          )}
          <div>
            <p className="font-mono text-sm text-zinc-200">
              @{author.username}
            </p>
            <p className="font-mono text-xs text-zinc-600">comment</p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mt-3 sm:mt-4">
          {content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 sm:gap-5 mt-4">
          {!isFormOpen && user && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="font-mono text-xs sm:text-sm text-zinc-600 hover:text-zinc-300 transition-colors min-h-[36px] flex items-center"
            >
              reply
            </button>
          )}

          {!isFormOpen && isReply === false && (replies?.length ?? 0) > 0 && (
            <button
              onClick={() => setSeeReplies((prev) => !prev)}
              className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-600 hover:text-zinc-300 transition-colors min-h-[36px]"
            >
              <span>
                {seeReplies ? "hide replies" : `replies (${replies?.length})`}
              </span>
              <SlArrowDown
                className={`text-xs transition-transform duration-150 ${seeReplies ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {/* Reply form */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              name="content"
              placeholder="Write a reply..."
              onChange={handleChange}
              value={formValue.content}
              className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2.5 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 transition-all min-h-[44px]"
                disabled={formValue.content.trim().length === 0}
              >
                reply
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 border border-zinc-700 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all min-h-[44px]"
              >
                cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Replies */}
      {seeReplies && (
        <div className="mt-3 flex flex-col gap-3">
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
        <div className="mt-3 flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          <span className="font-mono text-red-500 select-none">✕</span>
          {error}
        </div>
      )}
    </div>
  );
}

export default Comment;

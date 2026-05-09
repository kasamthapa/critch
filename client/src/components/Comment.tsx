import { useState } from "react";
import type { CommentType, CommentAuthor } from "../types/comment.types";
import { createComment } from "../api/project.api";
import { SlArrowDown } from "react-icons/sl";
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      ...formValue,
      projectId,
      parentId: cId,
    };
    try {
      await createComment(payload);
      setRefreshKey((prev) => prev + 1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <div
        style={{
          marginLeft: isReply ? 200 : 0,
        }}
      >
        <p>
          <img src={author.avatarURL} alt="userProfile" />
          {author.username}
        </p>
        <p>{content}</p>

        {isFormOpen && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="content"
              onChange={handleChange}
              value={formValue.content}
            />
            <button type="submit">reply</button>
          </form>
        )}
        {!isFormOpen && (
          <button onClick={() => setIsFormOpen(true)}>reply</button>
        )}
        {!isFormOpen && isReply == false && (replies?.length ?? 0) > 0 && (
          <div>
            <span>See replies..{replies?.length}</span>
            <button onClick={() => setSeeReplies((prev) => !prev)}>
              <SlArrowDown />
            </button>
          </div>
        )}
      </div>
      {seeReplies && (
        <div>
          {replies !== null &&
            replies?.map((r) => (
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
      {error}
    </div>
  );
}

export default Comment;

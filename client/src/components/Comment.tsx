import type { CommentType, CommentAuthor } from "../types/comment.types";
function Comment({
  user,
  content,
  replies,
  isReply,
}: {
  user: CommentAuthor;
  content: string;
  replies?: CommentType[];
  isReply: boolean;
}) {
  return (
    <div>
      <div style={{ marginLeft: isReply ? 200 : 0 }}>
        <p>
          {/* <img src={user.avatarURL} alt="userProfile" /> */}
          {user.username}
        </p>
        <p>{content}</p>
        <button>reply</button>
      </div>
      <div>
        {replies !== null &&
          replies?.map((r) => (
            <Comment
              key={r.id}
              isReply={true}
              user={r.user}
              content={r.content}
              replies={r.replies}
            />
          ))}
      </div>
    </div>
  );
}

export default Comment;

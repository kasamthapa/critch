export interface CommentAuthor {
  username: string;
  avatarURL: string;
}
export interface Comment {
  id: number;
  cotent: string;
  userId: number;
  projectId: number;
  user: CommentAuthor;
}

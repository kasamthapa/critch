export interface CommentAuthor {
  username: string;
  avatarURL: string;
}
export interface Comment {
  id: number;
  content: string;
  userId: number;
  projectId: number;
  parentId?: number;
  user: CommentAuthor;
}

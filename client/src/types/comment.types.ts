export interface CommentAuthor {
  username: string;
  avatarURL: string;
}
export interface CommentType {
  id: number;
  content: string;
  userId: number;
  projectId: number;
  parentId?: number;
  user: CommentAuthor;
  replies?: CommentType[];
}
export interface createCommentRequest {
  projectId: number;
  content: string;
  parentId?: number;
}

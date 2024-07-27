export type CreatePost = {
  title: string;
  content: string;
};

export type UpdatePost = Partial<CreatePost>;

export type Post = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
} & CreatePost;

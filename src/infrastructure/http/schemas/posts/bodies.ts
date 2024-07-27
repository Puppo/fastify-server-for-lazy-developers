import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const CreatePost = Type.Object({
  title: Type.String(),
  content: Type.String(),
});

export const UpdatePost = Type.Partial(CreatePost, {
  minProperties: 1,
});

export const Post = Type.Intersect([
  Type.Object({
    id: Type.Number(),
  }),
  CreatePost,
]);

export const PostsPaginated = CommonSchemas.Bodies.PaginationResult(Post);

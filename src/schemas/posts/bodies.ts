import {Type} from '@sinclair/typebox'
import CommonSchemas from '../commons/index.ts'

export const CreatePost = Type.Object({
  title: Type.String(),
  content: Type.String(),
})

export const UpdatePost = Type.Partial(CreatePost)

export const Post = Type.Intersect([
  Type.Object({
    id: Type.Number(),
  }),
  CreatePost,
])

export const PostsPaginated = CommonSchemas.Bodies.PaginationResult(Post)

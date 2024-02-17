import {Type} from "@sinclair/typebox";
import PaginationSchema from "../commons/index.ts";

export const PostsQuery = Type.Partial(
  Type.Intersect([
    PaginationSchema.Queries.Pagination,
    Type.Object({
      sort: Type.Array(
        Type.Union([
          Type.TemplateLiteral('${id|title|content}'),
          Type.TemplateLiteral('${id|title|content}.${asc|desc}')
        ])
      , { default: ['id.asc'] })
    })
  ])
);
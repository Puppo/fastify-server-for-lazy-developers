import { Type } from "@sinclair/typebox";

export const Pagination = Type.Object({
  offset: Type.Optional(Type.Number({ default: 0 })),
  limit: Type.Optional(Type.Number({ default: 10 })),
});

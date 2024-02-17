import {TSchema, Type} from '@sinclair/typebox'

export const PaginationResult = 
  <Schema extends TSchema>(itemsSchema: Schema) =>
    Type.Object({
      count: Type.Number({ default: 0 }),
      data: Type.Array(itemsSchema),
    })
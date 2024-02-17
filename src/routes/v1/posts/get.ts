import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import CommonSchemas from '../../../schemas/commons/index.ts';
import {PostSchemas} from "../../../schemas/index.ts";

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post,
      }
    }
  }, async (request) => {
    const {postId} = request.params;
    const post = await app.db
      .selectFrom('posts')
      .where('id', '=', postId)
      .select([
        'id',
        'title',
        'content',
      ])
      .executeTakeFirst();
    if (!post)
      throw app.httpErrors.notFound();
    
    return post;
  });

  app.get('/', {
    schema: {
      querystring: CommonSchemas.Queries.Pagination,
      response: {
        200: PostSchemas.Bodies.PostsPaginated,
      }
    }
  }, async ({ query: { offset, limit } }) => {
    const countQuery = app
      .db
      .selectFrom('posts')
      .select(({ fn }) =>
        [fn.count<number>('id').as('count')])
      .executeTakeFirst();
    const postsQuery = app
      .db
      .selectFrom('posts')
      .offset(offset)
      .limit(limit)
      .select([
        'id',
        'title',
        'content',
      ])
      .orderBy('created_at', 'asc')
      .execute();
    const [countResult, postsResult] = await Promise.all([countQuery, postsQuery]);
    return {
      count: countResult?.count ?? 0,
      data: postsResult,
    }
  });
}

export default route;
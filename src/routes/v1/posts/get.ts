import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import db from "../../../db/index.ts";
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
    const post = db.posts.find(post => post.id === postId);
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
  }, ({ query: { offset, limit } }) => ({
    count: db.posts.length,
    data: db.posts.slice(offset, offset + limit),
  }));
}

export default route;
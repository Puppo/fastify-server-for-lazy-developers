import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {PostSchemas} from "../../../schemas/index.ts";
import {decodeSort} from '../../../utils/decodeSort.ts';

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/:postId', {
    schema: {
      tags: ["Posts"],
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post,
      }
    }
  }, (request) => app.postsService.findById(request.params.postId));

  app.get('/', {
    schema: {
      tags: ["Posts"],
      querystring: PostSchemas.Queries.PostsQuery,
      response: {
        200: PostSchemas.Bodies.PostsPaginated,
      }
    },
  }, async ({ query: { offset, limit, sort } }) => app.postsService.findAll({ offset: offset!, limit: limit! }, decodeSort(sort!)));
}

export default route;
import {FastifyPluginAsyncTypebox} from "@fastify/type-provider-typebox";
import {PostSchemas} from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post,
      }
    }
  }, async ({params: { postId }}, reply) => {
    const post = await app.db
      .deleteFrom('posts')
      .where('id', '=', postId)
      .returning([
        'id',
        'title',
        'content',
      ])
      .executeTakeFirst();

    if (!post)
      return reply.status(204).send();

    return post;
  });
}

export default routes;
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
  }, ({params: { postId }}, reply) => app.postsService.delete(postId));
}

export default routes;
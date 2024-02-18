import {FastifyPluginAsyncTypebox} from "@fastify/type-provider-typebox";
import {PostSchemas} from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:postId', {
    schema: {
      tags: ["Posts"],
      params: PostSchemas.Params.PostId,
      body: PostSchemas.Bodies.UpdatePost,
      response: {
        200: PostSchemas.Bodies.Post,
      }
    }
  
  }, async (request) => app.postsService.update(request.params.postId, request.body));
}

export default routes;
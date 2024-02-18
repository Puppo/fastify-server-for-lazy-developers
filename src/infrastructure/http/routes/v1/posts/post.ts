import {FastifyPluginAsyncTypebox} from "@fastify/type-provider-typebox";
import {PostSchemas} from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post('/', {
    schema: {
      tags: ["Posts"],
      body: PostSchemas.Bodies.CreatePost,
      response: {
        201: PostSchemas.Bodies.Post,
      }
    }
  }, async (request, reply) => {
    const newPost = await app.postsService.create(request.body);
    return reply.status(201).send(newPost);
  });
}

export default routes;
import {FastifyPluginAsyncTypebox} from "@fastify/type-provider-typebox";
import db from "../../../db/index.ts";
import {PostSchemas} from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      body: PostSchemas.Bodies.UpdatePost,
      response: {
        200: PostSchemas.Bodies.Post,
      }
    }
  
  }, async (request, reply) => {
    const {postId} = request.params;
    const post = db.posts.find((p) => p.id === postId);
    if (!post)
      throw app.httpErrors.notFound();

    const updatedPost = {
      ...post,
      ...request.body,
      updatedAt: new Date(),
      id: postId,
    };
    db.posts = db.posts.map((p) => {
      if (p.id === postId) {
        return updatedPost;
      }
      return p;
    });
    return updatedPost;
  });
}

export default routes;
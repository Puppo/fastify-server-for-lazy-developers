import {FastifyInstance} from "fastify";
import db from "../../../db/index.ts";

export default async function (app: FastifyInstance) {
  app.delete<{
    Params: {
      postId: string;
    }
  }>('/:postId', async (request, reply) => {
    const postId = parseInt(request.params.postId, 10);
    const post = db.posts.find((p) => p.id === postId);
    if (!post) {
      reply.status(404);
      return {
        statusCode: 404,
        error: 'Not Found',
        message: `Post with id ${postId} not found`,
      };
    }
    db.posts = db.posts.filter((p) => p.id !== postId);
    return post;
  });
}
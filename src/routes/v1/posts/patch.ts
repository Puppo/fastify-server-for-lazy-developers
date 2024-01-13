import {FastifyInstance} from "fastify";
import db from "../../../db/index.ts";

export default async function (app: FastifyInstance) {
  app.patch<{
    Body: Partial<{
      title: string;
      content: string;
    }>,
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


    const {title, content} = request.body;
    const updatedPost = {
      ...post,
      ...request.body,
      id: post.id,
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
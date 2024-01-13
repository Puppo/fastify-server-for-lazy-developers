import {FastifyInstance} from "fastify";
import db from "../../../db/index.ts";

export default async function (app: FastifyInstance) {
  app.get<{
    Params: {
      postId: string;
    }
  }>('/:postId',async (request, reply) => {
    const postId = parseInt(request.params.postId, 10);
    const post = db.posts.find(post => post.id === postId);
    if (!post) {
      return reply.status(404).send({
        error: `Post with ${postId} not found`,
      });
    }
    return post;
  });

  app.get('/', async (request, reply) => {
    return db.posts;
  });
}
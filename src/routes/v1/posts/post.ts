import {FastifyInstance} from "fastify";
import db from "../../../db/index.ts";

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      title: string;
      content: string;
    }
  }>('/', async (request, reply) => {
    const {title, content} = request.body;
    const post = {
      id: db.posts.length + 1,
      title,
      content,
    };
    db.posts.push(post);

    reply.status(201);
    return post;
  });
}
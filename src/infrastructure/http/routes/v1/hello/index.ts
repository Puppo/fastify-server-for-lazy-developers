import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  app.get("/", {
    schema: {
      tags: ["Hello"],
    }
  }, async (request, reply) => {
    return {
      message: "Hello world"
    };
  });
}
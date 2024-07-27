import { FastifyInstance } from "fastify";
import { NotFoundException } from "../../../application/index.js";

export const errorHandler: FastifyInstance["errorHandler"] = function (
  error,
  request,
  reply,
) {
  if (error instanceof NotFoundException) {
    return reply.notFound(error.message);
  }

  reply.log.error(
    {
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        query: request.query,
        params: request.params,
      },
      error,
    },
    "Unhandled error occurred.",
  );
  return reply.code(500).send(error.message);
};

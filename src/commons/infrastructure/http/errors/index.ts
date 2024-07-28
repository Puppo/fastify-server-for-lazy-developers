import { pascalCase } from "change-case";
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

export function handleNotFound<TEntity extends Record<"id", number>>(
  entity: TEntity | undefined,
  id: TEntity["id"],
  name: string,
): asserts entity is TEntity {
  const entityName = pascalCase(name);
  if (!entity)
    throw new NotFoundException(`${entityName} with id ${id} not found`);
}

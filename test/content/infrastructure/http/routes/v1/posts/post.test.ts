import { FastifyInstance } from "fastify";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import PgDockerController from "../../../../../../PgDockerController.js";
import { createServer } from "../../../../../../utils/buildServer.js";

describe(`POST /v1/posts/{postId}`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  test("should create a post", async () => {
    const postData = {
      title: "title",
      content: "content",
    };

    const response = await server.inject({
      method: "POST",
      url: `/api/v1/posts`,
      payload: postData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toStrictEqual({
      id: expect.any(Number),
      ...postData,
    });
  });
});

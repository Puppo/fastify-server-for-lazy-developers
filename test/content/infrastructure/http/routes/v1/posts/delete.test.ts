import { FastifyInstance } from "fastify";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { PostDao } from "../../../../../../../src/content/infrastructure/dao/postDao.js";
import PgDockerController from "../../../../../../PgDockerController.js";
import { createServer } from "../../../../../../utils/buildServer.js";

describe("DELETE /v1/posts/{postId}", () => {
  let server: FastifyInstance;
  let postDao: PostDao;
  const pgDockerController = new PgDockerController();

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  beforeEach(async () => {
    postDao = new PostDao(pgDockerController.db);
  });

  test("should return 204 if delete post", async () => {
    const post = await postDao.create({
      title: "title",
      content: "content",
    });

    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/posts/${post.id}`,
    });

    expect(response.statusCode).toBe(204);
  });

  test("should return 204 if post does not exist", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/posts/1`,
    });

    expect(response.statusCode).toBe(204);
  });

  test("should return 204 if post does not exist", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/posts/1`,
    });

    expect(response.statusCode).toBe(204);
  });
});

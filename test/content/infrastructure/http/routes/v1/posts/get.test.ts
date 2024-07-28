import { FastifyInstance } from "fastify";
import { stringify } from "qs";
import { reverse } from "rambda";
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

describe(`GET /v1/posts`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;

  let postDao: PostDao;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  beforeEach(() => {
    postDao = new PostDao(pgDockerController.db);
  });

  describe("GET /", () => {
    beforeEach(async () => {
      for (let i = 0; i < 10; i++) {
        await postDao.create({
          title: `title ${i}`,
          content: `content ${i}`,
        });
      }
    });

    test("should return all posts", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          title: `title ${i}`,
          content: `content ${i}`,
        })),
      };

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/posts",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toStrictEqual(expectedResult);
    });

    test("should return paginated list", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `title ${i}`,
          content: `content ${i}`,
        })),
      };

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/posts",
        query: stringify({
          limit: 5,
          offset: 0,
        }),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toStrictEqual(expectedResult);
    });

    test("should return sorted list", async () => {
      const expectedResult = {
        count: 10,
        data: reverse(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            title: `title ${i}`,
            content: `content ${i}`,
          })),
        ),
      };

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/posts",
        query: stringify({
          sort: "title.desc",
        }),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toStrictEqual(expectedResult);
    });
  });

  describe("GET /{postId}", () => {
    test("should get a post", async () => {
      const post = await postDao.create({
        title: "title",
        content: "content",
      });

      const response = await server.inject({
        method: "GET",
        url: `/api/v1/posts/${post.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toStrictEqual({
        id: post.id,
        title: post.title,
        content: post.content,
      });
    });

    test(`should return 404 if post doesn't exists`, async () => {
      const response = await server.inject({
        method: "GET",
        url: `/api/v1/posts/1`,
      });

      expect(response.statusCode).toBe(404);
    });
  });
});

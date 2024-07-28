import { reverse } from "rambda";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { PostDao } from "../../../../src/content/infrastructure/dao/postDao.js";
import PgDockerController from "../../../PgDockerController.js";

describe("postDao", () => {
  const pgDockerController = new PgDockerController();
  let postDao: PostDao;

  beforeAll(() => pgDockerController.setup());

  beforeEach(() => {
    postDao = new PostDao(pgDockerController.db);
  });

  afterEach(() => pgDockerController.reset());

  describe("create", () => {
    test("should create a post", async () => {
      const postData = {
        title: "title",
        content: "content",
      };

      const post = await postDao.create(postData);

      expect(post).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        ...postData,
      });
    });
  });

  describe("findAll", () => {
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const posts = await postDao.findAll(
        {
          limit: 10,
          offset: 0,
        },
        [["title", "asc"]],
      );

      expect(posts).toStrictEqual(expectedResult);
    });

    test("should return paginated posts", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `title ${i}`,
          content: `content ${i}`,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const posts = await postDao.findAll(
        {
          limit: 5,
          offset: 0,
        },
        [["title", "asc"]],
      );

      expect(posts).toStrictEqual(expectedResult);
    });

    test("should return sorted posts", async () => {
      const expectedResult = {
        count: 10,
        data: reverse(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            title: `title ${i}`,
            content: `content ${i}`,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          })),
        ),
      };

      const posts = await postDao.findAll(
        {
          limit: 10,
          offset: 0,
        },
        [["title", "desc"]],
      );

      expect(posts).toStrictEqual(expectedResult);
    });
  });

  describe("findById", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await postDao.create({
        title: "title",
        content: "content",
      }));
    });

    test("should return a post", async () => {
      const post = await postDao.findById(id);

      expect(post).toEqual({
        id: id,
        title: "title",
        content: "content",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test("should return undefined if post is not found", async () => {
      const post = await postDao.findById(2);

      expect(post).toBeUndefined();
    });
  });

  describe("update", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await postDao.create({
        title: "title",
        content: "content",
      }));
    });

    test("should update a post", async () => {
      const updatedPost = await postDao.update(id, {
        title: "new title",
        content: "new content",
      });

      expect(updatedPost).toEqual({
        id: id,
        title: "new title",
        content: "new content",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test("should return undefined if post is not found", async () => {
      const post = await postDao.update(2, {
        title: "new title",
        content: "new content",
      });

      expect(post).toBeUndefined();
    });
  });

  describe("delete", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await postDao.create({
        title: "title",
        content: "content",
      }));
    });

    test("should delete a post", async () => {
      const post = await postDao.delete(id);

      expect(post).toEqual({
        id: id,
        title: "title",
        content: "content",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const deletedPost = await postDao.findById(id);
      expect(deletedPost).toBeUndefined();
    });

    test("should return undefined if post is not found", async () => {
      const post = await postDao.delete(2);

      expect(post).toBeUndefined();
    });
  });
});

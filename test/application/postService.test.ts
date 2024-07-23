import { afterEach, beforeEach, describe, expect, Mocked, test, vi } from "vitest";
import { IPostRepository, Post, PostService } from "../../src/application/index.js";

const mockPost: Post = {
  id: 1,
  title: "Post title",
  content: "Post content",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("PostService", () => {
  let mockedPostRepository: Mocked<IPostRepository>;
  let postService: PostService;

  beforeEach(() => {
    mockedPostRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    postService = new PostService(mockedPostRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  })

  describe("create", () => {
    test("should create a post", async () => {
      mockedPostRepository.create.mockResolvedValue(mockPost);

      const createdPost = await postService.create({
        title: "Post title",
        content: "Post content",
      });

      expect(createdPost).toEqual(mockPost);
      expect(mockedPostRepository.create).toHaveBeenCalledOnce();
      expect(mockedPostRepository.create).toHaveBeenCalledWith({
        title: "Post title",
        content: "Post content",
      });
    })
  });

  describe("findAll", () => {
    test("should find all posts", async () => {
      mockedPostRepository.findAll.mockResolvedValue({
        data: [mockPost],
        count: 1,
      });

      const posts = await postService.findAll({
        limit: 10,
        offset: 0,
      }, [['createdAt', 'asc']]);

      expect(posts).toEqual({
        data: [mockPost],
        count: 1,
      });
      expect(mockedPostRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedPostRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      }, [['createdAt', 'asc']]);
    });
  });

  describe("findById", () => {
    test("should find a post by id", async () => {
      mockedPostRepository.findById.mockResolvedValue(mockPost);

      const foundPost = await postService.findById(1);

      expect(foundPost).toEqual(mockPost);
      expect(mockedPostRepository.findById).toHaveBeenCalledOnce();
      expect(mockedPostRepository.findById).toHaveBeenCalledWith(1);
    });

    test("should throw an error if post not found", async () => {
      mockedPostRepository.findById.mockResolvedValue(undefined);

      await expect(postService.findById(1)).rejects.toThrow("Post with id 1 not found");
    });
  });

  describe("update", () => {
    test("should update a post", async () => {
      mockedPostRepository.update.mockResolvedValue(mockPost);

      const updatedPost = await postService.update(1, {
        title: "Post title",
        content: "Post content",
      });

      expect(updatedPost).toEqual(mockPost);
      expect(mockedPostRepository.update).toHaveBeenCalledOnce();
      expect(mockedPostRepository.update).toHaveBeenCalledWith(1, {
        title: "Post title",
        content: "Post content",
      });
    });

    test("should throw an error if post not found", async () => {
      mockedPostRepository.update.mockResolvedValue(undefined);

      await expect(postService.update(1, {
        title: "Post title",
        content: "Post content",
      })).rejects.toThrow("Post with id 1 not found");
    });
  });

  describe("delete", () => {
    test("should delete a post", async () => {
      mockedPostRepository.delete.mockResolvedValue(mockPost);

      const deletedPost = await postService.delete(1);

      expect(deletedPost).toEqual(mockPost);
      expect(mockedPostRepository.delete).toHaveBeenCalledOnce();
      expect(mockedPostRepository.delete).toHaveBeenCalledWith(1);
    });
  });

});
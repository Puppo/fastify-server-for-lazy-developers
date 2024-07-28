import type {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../commons/application/index.js";
import { handleNotFound } from "../../commons/infrastructure/http/errors/index.js";
import type { CreatePost, Post, UpdatePost } from "./models.js";
import type { IPostRepository } from "./postRepository.js";

export class PostService {
  private readonly ENTITY_NAME = "Post";

  constructor(protected readonly postRepository: IPostRepository) {}

  create(post: CreatePost): Promise<Post> {
    return this.postRepository.create(post);
  }
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Post>,
  ): Promise<PaginatedResult<Post>> {
    return this.postRepository.findAll(pagination, sortBy);
  }
  async findById(id: Post["id"]): Promise<Post> {
    const post = await this.postRepository.findById(id);
    handleNotFound(post, id, this.ENTITY_NAME);
    return post;
  }
  async update(id: Post["id"], post: UpdatePost): Promise<Post> {
    const updatedPost = await this.postRepository.update(id, post);
    handleNotFound(updatedPost, id, this.ENTITY_NAME);
    return updatedPost;
  }
  delete(id: Post["id"]): Promise<Post | undefined> {
    return this.postRepository.delete(id);
  }
}

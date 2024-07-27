import { NotFoundException } from "../commons/exceptions.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreatePost, Post, UpdatePost } from "./models.js";
import { IPostRepository } from "./postRepository.js";

export class PostService {
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
    this.handleNotFound(post, id);
    return post;
  }
  async update(id: Post["id"], post: UpdatePost): Promise<Post> {
    const updatedPost = await this.postRepository.update(id, post);
    this.handleNotFound(updatedPost, id);
    return updatedPost;
  }
  async delete(id: Post["id"]): Promise<Post> {
    const deletedPost = await this.postRepository.delete(id);
    this.handleNotFound(deletedPost, id);
    return deletedPost;
  }

  private handleNotFound(
    post: Post | undefined,
    id: Post["id"],
  ): asserts post is Post {
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
  }
}

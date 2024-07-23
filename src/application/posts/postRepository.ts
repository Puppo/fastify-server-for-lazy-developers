import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreatePost, Post, UpdatePost } from "./models.js";

export interface IPostRepository {
  create(post: CreatePost): Promise<Post>;
  findAll(pagination: Pagination, sortBy: SortBy<Post>): Promise<PaginatedResult<Post>>;
  findById(id: Post['id']): Promise<Post | undefined>;
  update(id: Post['id'], post: UpdatePost): Promise<Post | undefined>;
  delete(id: Post['id']): Promise<Post | undefined>;
}
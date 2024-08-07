import type { Kysely, SelectExpression } from "kysely";
import type { DB } from "kysely-codegen";
import { prop } from "rambda";
import type {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../../commons/application/index.js";
import { buildSortBy } from "../../../commons/infrastructure/dao/utils.js";
import type {
  CreatePost,
  IPostRepository,
  Post,
  UpdatePost,
} from "../../application/index.js";

export class PostDao implements IPostRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "title",
    "content",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "posts">>;

  constructor(protected readonly db: Kysely<DB>) {}
  create(newPost: CreatePost): Promise<Post> {
    return this.db
      .insertInto("posts")
      .values(newPost)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow();
  }
  async findAll(
    pagination: Pagination,
    sortBy: SortBy<Post>,
  ): Promise<PaginatedResult<Post>> {
    const countQuery = this.db
      .selectFrom("posts")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst()
      .then(prop("count"))
      .then(Number);

    const postsQuery = this.db
      .selectFrom("posts")
      .orderBy(buildSortBy<"posts", Post>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute();

    const [countResult, postsResult] = await Promise.all([
      countQuery,
      postsQuery,
    ]);
    return {
      count: countResult ?? 0,
      data: postsResult,
    };
  }
  findById(id: Post["id"]): Promise<Post | undefined> {
    return this.db
      .selectFrom("posts")
      .where("id", "=", id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
  update(id: Post["id"], post: UpdatePost): Promise<Post | undefined> {
    return this.db
      .updateTable("posts")
      .set(post)
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
  delete(id: Post["id"]): Promise<Post | undefined> {
    return this.db
      .deleteFrom("posts")
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
}

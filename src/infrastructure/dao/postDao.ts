import {Kysely, SelectExpression} from 'kysely';
import {DB} from 'kysely-codegen';
import {
  CreatePost,
  IPostRepository,
  PaginatedResult,
  Pagination,
  Post,
  SortBy,
  UpdatePost
} from '../../application/index.ts';
import {buildSortBy} from './utils.ts';

export class PostDao implements IPostRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'id',
    'title',
    'content',
    'created_at as createdAt',
    'updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'posts'>>;

  constructor(protected readonly db: Kysely<DB>) {
  }
  create(newPost: CreatePost): Promise<Post> {
    return this.db
      .insertInto('posts')
      .values(newPost)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow();
  }
  async findAll(pagination: Pagination, sortBy: SortBy<Post>): Promise<PaginatedResult<Post>> {
    const countQuery = this
      .db
      .selectFrom('posts')
      .select(({ fn }) =>
        [fn.count<number>('id').as('count')])
      .executeTakeFirst();
    
    const postsQuery = this
      .db
      .selectFrom('posts')
      .orderBy(buildSortBy<'posts', Post>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute()

    const [countResult, postsResult] = await Promise.all([countQuery, postsQuery]);
    return {
      count: countResult?.count ?? 0,
      data: postsResult
    };
  }
  findById(id: Post['id']): Promise<Post | undefined> {
    return this.db
      .selectFrom('posts')
      .where('id', '=', id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
  update(id: Post['id'], post: UpdatePost): Promise<Post | undefined> {
    return this.db
      .updateTable('posts')
      .set(post)
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
  delete(id: Post['id']): Promise<Post | undefined> {
    return this.db
      .deleteFrom('posts')
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

}
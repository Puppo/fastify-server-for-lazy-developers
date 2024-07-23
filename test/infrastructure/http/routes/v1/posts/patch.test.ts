import { FastifyInstance } from 'fastify';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { PostDao } from '../../../../../../src/infrastructure/dao/postDao.js';
import PgDockerController from '../../../../../PgDockerController.js';
import { createServer } from '../../../../../utils/buildServer.js';


describe(`PATCH /v1/posts/{postId}`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;

  let postDao: PostDao;

  beforeAll(async () =>{
    await pgDockerController.setup()
    server = await createServer()
  })

  afterAll(() => server.close())

  afterEach(() => pgDockerController.reset())

  beforeEach(() => {
    postDao = new PostDao(pgDockerController.db);
  });

  test('should edit a post', async () => {
    const post = await postDao.create({
      title: 'title',
      content: 'content'
    });

    const updatedPost = {
      title: 'new title',
      content: 'new content',
    }

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/posts/${post.id}`,
      payload: updatedPost
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toStrictEqual({
      id: post.id,
      ...updatedPost
    })
  })

  test(`should return 404 if post doesn't exists`, async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/posts/1`,
      payload: {
        title: 'title'
      }
    })

    expect(response.statusCode).toBe(404)
  })
})
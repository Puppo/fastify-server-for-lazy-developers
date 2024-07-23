import { FastifyInstance } from 'fastify';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { PostDao } from '../../../../../../src/infrastructure/dao/postDao.js';
import PgDockerController from '../../../../../PgDockerController.js';
import { createServer } from '../../../../../utils/buildServer.js';

describe(`POST /v1/posts/{postId}`, () => {
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

  test('should create a post', async () => {
    const postData = {
      title: 'title',
      content: 'content'
    }

    const response = await server.inject({
      method: 'POST',
      url: `/api/v1/posts`,
      payload: postData
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toStrictEqual({
      id: expect.any(Number),
      ...postData
    })
  })
})
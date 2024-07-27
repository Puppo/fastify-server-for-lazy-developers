import fp from "fastify-plugin";
import { PostService } from "../../application/index.js";
import { IPostRepository } from "../../application/posts/index.js";
import { PostDao } from "../dao/postDao.js";

declare module "fastify" {
  interface FastifyInstance {
    postsService: PostService;
  }
}

export default fp(async (fastify) => {
  const postsRepository: IPostRepository = new PostDao(fastify.db);
  const postsService = new PostService(postsRepository);
  fastify.decorate("postsService", postsService);
});

import fp from "fastify-plugin";
import { IPostRepository, PostService } from "../../application/index.js";
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
  fastify.log.info("Posts service registered");
});

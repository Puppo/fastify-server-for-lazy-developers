import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { PostSchemas } from "../../../schemas/index.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:postId",
    {
      schema: {
        tags: ["Posts"],
        params: PostSchemas.Params.PostId,
        response: {
          200: PostSchemas.Bodies.Post,
        },
      },
    },
    ({ params: { postId } }) => app.postsService.delete(postId),
  );
};

export default routes;

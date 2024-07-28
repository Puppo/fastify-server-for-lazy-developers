import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { PostSchemas } from "../../../schemas/index.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:postId",
    {
      schema: {
        tags: ["Posts"],
        params: PostSchemas.Params.PostId,
        body: PostSchemas.Bodies.UpdatePost,
        response: {
          200: PostSchemas.Bodies.Post,
        },
      },
    },
    (request) => app.postsService.update(request.params.postId, request.body),
  );
};

export default routes;

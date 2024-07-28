import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import CommonSchemas from "../../../../../../commons/infrastructure/http/schemas/index.js";
import { PostSchemas } from "../../../schemas/index.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:postId",
    {
      schema: {
        tags: ["Posts"],
        params: PostSchemas.Params.PostId,
        response: {
          204: CommonSchemas.Bodies.NoContent,
        },
      },
    },
    ({ params: { postId } }, res) => {
      res.status(204);
      return app.postsService.delete(postId);
    },
  );
};

export default routes;

import {FastifyPluginAsyncTypebox} from "@fastify/type-provider-typebox";
import {sql} from "kysely";
import {PostSchemas} from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      body: PostSchemas.Bodies.UpdatePost,
      response: {
        200: PostSchemas.Bodies.Post,
      }
    }
  
  }, async (request) => {
    const {postId} = request.params;
    const updatedPost = app
      .db
      .updateTable('posts')
      .set({
        ...request.body,
        updated_at: () => sql`CURRENT_TIMESTAMP`,
      })
      .where('id', '=', postId)
      .returning([
        'id',
        'title',
        'content',
      ])
      .executeTakeFirst();
    if (!updatedPost)
      throw app.httpErrors.notFound();

    return updatedPost;
  });
}

export default routes;
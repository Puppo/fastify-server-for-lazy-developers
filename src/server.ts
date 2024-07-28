import { FastifyInstance } from "fastify";
import { errorHandler } from "./commons/infrastructure/http/errors/index.js";

export default async function (app: FastifyInstance) {
  app.register(import("@fastify/sensible"));

  app.register(import("@fastify/swagger"));
  app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
  });

  app.register(import("./commons/index.js"));
  app.register(import("./content/index.js"));

  app.setErrorHandler(errorHandler);

  app.ready(() => {
    app.log.info(app.printRoutes());
  });
}

import autoLoad from "@fastify/autoload";
import { FastifyInstance } from 'fastify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from "./http/errors/index.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function (app: FastifyInstance) {
  app.register(import('@fastify/sensible'));

  app.register(import('@fastify/swagger'));
  app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/documentation'
  });

  app.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    forceESM: true,
  });
  app.register(autoLoad, {
    dir: join(__dirname, 'services'),
    forceESM: true,
  });
  app.register(autoLoad, {
    dir: join(__dirname, 'http/routes'),
    options: { prefix: '/api' },
    forceESM: true,
  });

  app.setErrorHandler(errorHandler);

  app.ready(() => {
    app.log.info(app.printRoutes());
  });
}
import autoLoad from "@fastify/autoload";
import {FastifyInstance} from 'fastify';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function (app: FastifyInstance) {
  app.register(import('@fastify/sensible'));
  app.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    forceESM: true,
  });
  app.register(autoLoad, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' },
    forceESM: true,
  });

  app.ready(() => {
    app.log.info(app.printRoutes());
  });
}
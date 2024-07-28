import autoLoad from "@fastify/autoload";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), "infrastructure");

export default fp(async function (app: FastifyInstance) {
  app.register(autoLoad, {
    dir: join(__dirname, "plugins"),
    forceESM: true,
    encapsulate: false,
  });
});

import autoLoad from "@fastify/autoload";
import { FastifyInstance } from "fastify";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), "infrastructure");

export default async function (app: FastifyInstance) {
  app.register(autoLoad, {
    dir: join(__dirname, "services"),
    forceESM: true,
  });
  app.register(autoLoad, {
    dir: join(__dirname, "http/routes"),
    options: { prefix: "/api" },
    forceESM: true,
  });
}

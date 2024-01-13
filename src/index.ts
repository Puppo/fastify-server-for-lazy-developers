import fastify from "fastify";
import buildServer from "./server.ts";

async function run() {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      },
    },
  });
  app.register(buildServer)

  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

run();

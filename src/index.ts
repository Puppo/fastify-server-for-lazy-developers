import fastify from "fastify";
import qs from "qs";
import buildServer from "./server.js";

async function run() {
  const app = fastify({
    querystringParser: (str) => qs.parse(str),
    logger: {
      transport: {
        target: "pino-pretty",
      },
      redact: {
        paths: ["[*].password", "[*].user"],
        censor: "***",
      },
    },
  });
  app.register(buildServer);

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

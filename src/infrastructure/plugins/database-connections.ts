import fp from "fastify-plugin";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import pg from "pg";
import { DatabaseConnectionsConfig, buildDbConfig } from "../env/dbConfig.js";
const { Pool } = pg;

export function createDbConnection(config: DatabaseConnectionsConfig) {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: config.default.host,
        port: config.default.port,
        user: config.default.username,
        password: config.default.password,
        database: config.default.database,
      }),
    }),
    log: ["error"],
  });
}

declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<DB>;
  }
}

export default fp(async (fastify) => {
  const config = buildDbConfig();
  fastify.log.info(config, "Connecting to database");
  const db = createDbConnection(config);
  fastify.decorate("db", db);
  fastify.addHook("onClose", () => db.destroy());
  fastify.log.info("Connected to database");
});

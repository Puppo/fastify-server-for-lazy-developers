import {Static, Type} from '@sinclair/typebox';
import envSchema from 'env-schema';
import fp from 'fastify-plugin';
import {Kysely, PostgresDialect} from 'kysely';
import {DB} from 'kysely-codegen';
import pg from 'pg';
const {Pool} = pg;

const DatabaseConnectionsConfigSchema = Type.Object({
  default: Type.Object({
    host: Type.String(),
    port: Type.Number(),
    user: Type.String(),
    password: Type.String(),
    db: Type.String(),
  })
})

const config = envSchema<Static<typeof DatabaseConnectionsConfigSchema>>({
  schema: DatabaseConnectionsConfigSchema,
  data: {
    default: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      db: process.env.POSTGRES_DB,
    }
  },
})

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>;
  }
}

export default fp(async (fastify) => {
  fastify.log.info(config, 'Connecting to database');
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: config.default.host,
        port: config.default.port,
        user: config.default.user,
        password: config.default.password,
        database: config.default.db,
      }),
    }),
  });
  fastify.decorate('db', db);
  fastify.addHook('onClose', () => db.destroy());
  fastify.log.info('Connected to database');
});
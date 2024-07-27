import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const DatabaseConnectionsConfig = Type.Object({
  default: Type.Object({
    host: Type.String(),
    port: Type.Number(),
    username: Type.String(),
    password: Type.String(),
    database: Type.String(),
  }),
});
const SchemaCompiler = TypeCompiler.Compile(DatabaseConnectionsConfig);

export type DatabaseConnectionsConfig = Static<
  typeof DatabaseConnectionsConfig
>;

export function buildDbConfig(): DatabaseConnectionsConfig {
  const config = {
    default: {
      host: process.env.POSTGRES_HOST,
      port:
        Number(process.env.POSTGRES_PORT) +
        (Number(process.env.VITEST_WORKER_ID) || 0),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
  };
  if (SchemaCompiler.Check(config)) {
    return config;
  }
  throw new Error(
    `Invalid database configuration ${JSON.stringify([...SchemaCompiler.Errors(config)])})}`,
  );
}

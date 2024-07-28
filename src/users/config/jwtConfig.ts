import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const JwtConfigSchema = Type.Object({
  issuer: Type.String(),
  audience: Type.String(),
  expirationTime: Type.String(),
  secretKey: Type.String(),
});

const SchemaCompiler = TypeCompiler.Compile(JwtConfigSchema);

export type JwtConfig = Static<typeof JwtConfigSchema>;

export function buildJwtConfig(): JwtConfig {
  const config = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    expirationTime: process.env.JWT_EXPIRATION_TIME,
    secretKey: process.env.JWT_SECRET_KEY,
  };
  if (SchemaCompiler.Check(config)) {
    return config;
  }
  throw new Error(
    `Invalid jwt configuration ${JSON.stringify([...SchemaCompiler.Errors(config)])})}`,
  );
}

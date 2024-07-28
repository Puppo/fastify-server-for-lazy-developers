import { createSecretKey, KeyObject } from "crypto";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { JwtConfig } from "../config/jwtConfig.js";
import { User } from "./models.js";

export class AuthTokenService {
  private readonly secretKey: KeyObject;

  constructor(private readonly jwtConfig: JwtConfig) {
    this.secretKey = createSecretKey(this.jwtConfig.secretKey, "utf8");
  }

  generateToken(user: User): Promise<string> {
    return new SignJWT(user)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setIssuer(this.jwtConfig.issuer)
      .setAudience(this.jwtConfig.audience)
      .setExpirationTime(this.jwtConfig.expirationTime)
      .sign(this.secretKey);
  }
  async verifyToken(token: string): Promise<User & JWTPayload> {
    const { payload } = await jwtVerify<User & JWTPayload>(
      token,
      this.secretKey,
      {
        issuer: this.jwtConfig.issuer,
        audience: this.jwtConfig.audience,
      },
    );

    return payload;
  }
}

import { pbkdf2Sync, randomBytes } from "crypto";
import type { PasswordHashWithSalt } from "./models.js";

export class PasswordService {
  generateHash(password: string): PasswordHashWithSalt {
    const salt = randomBytes(32).toString("hex");
    return {
      salt,
      hash: this.genHash(password, salt),
    };
  }
  compare(password: string, hash: string, salt: string): boolean {
    return hash === this.genHash(password, salt);
  }

  private genHash(password: string, salt: string): string {
    return pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  }
}

import type { PasswordHashWithSalt, SignUp, User } from "./models.js";

export interface IUserRepository {
  signUp(
    user: Omit<SignUp, "password">,
    passwordHash: PasswordHashWithSalt,
  ): Promise<User>;
  findById(id: User["id"]): Promise<User | undefined>;
  findByEmail(email: User["email"]): Promise<User | undefined>;
  getPasswordHash(user: User): Promise<PasswordHashWithSalt>;
  delete(id: User["id"]): Promise<User | undefined>;
}

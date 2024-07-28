import type { Kysely, SelectExpression } from "kysely";
import type { DB } from "kysely-codegen";
import type {
  IUserRepository,
  PasswordHashWithSalt,
  SignUp,
  User,
} from "../../application/index.js";

export class UserDao implements IUserRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "name",
    "surname",
    "email",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "users">>;

  constructor(protected readonly db: Kysely<DB>) {}
  signUp(
    user: Omit<SignUp, "password">,
    { hash, salt }: PasswordHashWithSalt,
  ): Promise<User> {
    return this.db
      .insertInto("users")
      .values({
        ...user,
        password_hash: hash,
        password_salt: salt,
      })
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow();
  }
  findById(id: User["id"]): Promise<User | undefined> {
    return this.db
      .selectFrom("users")
      .where("id", "=", id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
  findByEmail(email: User["email"]): Promise<User | undefined> {
    return this.db
      .selectFrom("users")
      .where("email", "=", email)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
  getPasswordHash(user: User): Promise<PasswordHashWithSalt> {
    return this.db
      .selectFrom("users")
      .where("id", "=", user.id)
      .select(["password_hash as hash", "password_salt as salt"])
      .executeTakeFirstOrThrow();
  }
  delete(id: User["id"]): Promise<User | undefined> {
    return this.db
      .deleteFrom("users")
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
}

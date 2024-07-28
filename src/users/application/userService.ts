import { UnauthorizedException } from "../../commons/application/index.js";
import { handleNotFound } from "../../commons/infrastructure/http/errors/index.js";
import { AuthTokenService } from "./authTokenService.js";
import { AuthenticationToken, SignIn, SignUp, User } from "./models.js";
import { PasswordService } from "./passwordService.js";
import { IUserRepository } from "./userRepository.js";

export class UserService {
  private readonly ENTITY_NAME = "User";

  constructor(
    protected readonly passwordService: PasswordService,
    protected readonly authTokenService: AuthTokenService,
    protected readonly userRepository: IUserRepository,
  ) {}

  signUp({ password, ...user }: SignUp): Promise<User> {
    return this.userRepository.signUp(
      user,
      this.passwordService.generateHash(password),
    );
  }
  async signIn({ email, password }: SignIn): Promise<AuthenticationToken> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const { hash, salt } = await this.userRepository.getPasswordHash(user);
    const isPasswordValid = this.passwordService.compare(password, hash, salt);
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");
    return {
      accessToken: await this.authTokenService.generateToken(user),
    };
  }

  async findById(id: User["id"]): Promise<User> {
    const user = await this.userRepository.findById(id);
    handleNotFound(user, id, this.ENTITY_NAME);
    return user;
  }
  delete(id: User["id"]): Promise<User | undefined> {
    return this.userRepository.delete(id);
  }
}

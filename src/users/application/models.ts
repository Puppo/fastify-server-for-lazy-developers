export type SignUp = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

export type SignIn = {
  email: string;
  password: string;
};

export type AuthenticationToken = {
  accessToken: string;
};

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PasswordHashWithSalt = {
  hash: string;
  salt: string;
};

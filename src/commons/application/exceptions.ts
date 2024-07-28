export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

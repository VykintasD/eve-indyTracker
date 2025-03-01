export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class AuthenticationError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
export class TableError extends Error {
  constructor(message: string) {
    super(message);
  }
}

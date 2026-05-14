export class AuthError extends Error {
  field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

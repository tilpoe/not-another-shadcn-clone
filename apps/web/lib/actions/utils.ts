export const DEFAULT_SERVER_ERROR =
  "Something went wrong while executing the operation";

export const isError = (error: any): error is Error => error instanceof Error;

export class BetterActionError<Errors extends readonly string[]> extends Error {
  private reason: Errors[number];

  constructor(message: Errors[number]) {
    super(message);
    this.reason = message;
  }

  getReason() {
    return this.reason;
  }
}

import { CustomError } from "./CustomError";


/** 4xx Client Error
 * The request could not be understood by the server due to malformed syntax.
 * The client SHOULD NOT repeat the request without modifications.
 * Wikipedia
 * The request cannot be fulfilled due to bad syntax.
 * General error when fulfilling the request would cause an invalid state. Domain validation errors, missing data, etc. are some examples.
 */
export class BadRequestError extends CustomError {
  statusCode = 400;
  errorType = "Bad Request";

  constructor(public message: string, private field?: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, field: this.field }];
  }
}
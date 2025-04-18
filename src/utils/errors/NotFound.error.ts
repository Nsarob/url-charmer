import { CustomError } from "./CustomError";

/**
 * The server has not found anything matching the Request-URI.
 * No indication is given of whether the condition is temporary or permanent.
 * The 410 (Gone) status code SHOULD be used if the server knows, through some internally configurable mechanism, that an old resource is permanently unavailable and has no forwarding address.
 * This status code is commonly used when the server does not wish to reveal exactly why the request has been refused, or when no other response is applicable.
 * Wikipedia
 * The requested resource could not be found but may be available again in the future.
 * Subsequent requests by the client are permissible.
 * Used when the requested resource is not found, whether it doesn't exist or if there was a 401 or 403 that, for security reasons, the service wants to mask.
 */
export class NotFoundError extends CustomError {
  statusCode = 404;
  errorType = "Not Found";

  constructor(msg: string = "Resource not found") {
    super(msg);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

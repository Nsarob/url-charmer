import { CustomError } from "./CustomError";

/** 4xx Client Error
 * The request requires user authentication.
 * The response MUST include a WWW-Authenticate header field containing a challenge applicable to the requested resource.
 * The client MAY repeat the request with a suitable Authorization header field.
 * If the request already included Authorization credentials, then the 401 response indicates that authorization has been refused for those credentials.
 * If the 401 response contains the same challenge as the prior response, and the user agent has already attempted authentication at least once,
 * then the user SHOULD be presented the entity that was given in the response,
 * since that entity might include relevant diagnostic information. HTTP access authentication is explained in "HTTP Authentication: Basic and Digest Access Authentication".
 * Wikipedia
 * Similar to 403 Forbidden, but specifically for use when authentication is possible but has failed or not yet been provided.
 * The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.
 * Error code response for missing or invalid authentication token.
 */
export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  errorType = "Authorization Error";

  constructor(msg: string = "Not authorized") {
    super(msg);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
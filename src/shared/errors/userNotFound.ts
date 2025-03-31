import { BadRequestError } from "utils/errors";

export class UserNotFoundError extends BadRequestError {
  constructor(
    message: string = " Request user is not an instance of User",
    field: "req.user" = "req.user"
  ) {
    super(message, field);
  }
} 
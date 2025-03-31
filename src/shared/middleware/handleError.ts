import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../utils/errors/CustomError";

const handleError = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {

  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .json({
        status: "Failed",
        message: error.errorType,
        data: error.message,
      });
  }

  return res.status(500).json({
    status: "Failed",
    message: "Internal Server Error",
    data: error.message,
  });
  
};

export default handleError;

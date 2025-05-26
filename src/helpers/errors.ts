import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  statusCode: number;

  private constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }

  static notFound(message: string): AppError {
    return new AppError(message, "NOT_FOUND_ERR", StatusCodes.NOT_FOUND);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, "BAD_REQUEST_ERR", StatusCodes.BAD_REQUEST);
  }

  static unauthenticated(message: string): AppError {
    return new AppError(
      message,
      "UNAUTHENTICATED_ERR",
      StatusCodes.UNAUTHORIZED
    );
  }

  static forbidden(message: string): AppError {
    return new AppError(message, "FORBIDDEN", StatusCodes.FORBIDDEN);
  }

  static unauthorized(message: string): AppError {
    return new AppError(message, "UNAUTHORIZED_ERR", StatusCodes.FORBIDDEN);
  }

  static internalServerError(message: string): AppError {
    return new AppError(
      message,
      "INTERNAL_SERVER_ERR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

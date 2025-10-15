export class ResponseHandler {
  // Create success response
  static success<T>(
    data: T,
    message: string = "Success"
  ): {
    success: true;
    message: string;
    data: T;
    timestamp: string;
  } {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  // Create error response
  static error(
    code: string,
    message: string,
    status: number = 400
  ): {
    success: false;
    error: {
      code: string;
      message: string;
      status: number;
    };
    timestamp: string;
  } {
    return {
      success: false,
      error: {
        code,
        message,
        status,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Common success responses
  static created<T>(
    data: T,
    message: string = "Resource created successfully"
  ) {
    return this.success(data, message);
  }

  static updated<T>(
    data: T,
    message: string = "Resource updated successfully"
  ) {
    return this.success(data, message);
  }

  static deleted(message: string = "Resource deleted successfully") {
    return this.success(null, message);
  }

  static retrieved<T>(
    data: T,
    message: string = "Resource retrieved successfully"
  ) {
    return this.success(data, message);
  }
  // Common error responses
  static notFound(message: string = "Resource not found") {
    return this.error("not_found", message, 404);
  }

  static badRequest(message: string = "Bad request") {
    return this.error("bad_request", message, 400);
  }

  static unauthorized(message: string = "Unauthorized") {
    return this.error("unauthorized", message, 401);
  }

  static forbidden(message: string = "Forbidden") {
    return this.error("forbidden", message, 403);
  }

  static conflict(message: string = "Resource already exists") {
    return this.error("conflict", message, 409);
  }

  static internalError(message: string = "Internal server error") {
    return this.error("internal_server_error", message, 500);
  }

  static validationError(message: string = "Validation failed") {
    return this.error("invalid_input", message, 400);
  }
}

export const reqHandler = new ResponseHandler();

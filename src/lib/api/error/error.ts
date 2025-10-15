import { errorCodeToHttpStatusCode } from "@/lib/api/error/status";
import { logger } from "@/lib/logger/logger";
import { ErrorCodeEnumType } from "@/lib/zod/schemas/response";
import { TRPCError } from "@trpc/server";

import { ZodError } from "zod";
import { ResponseHandler } from "../response/response";
import { errorCodeToSpeakeasyError } from "./code";

// Handle API error and return the error and status code
export function handleApiError(error: unknown): {
  error: unknown;
} {
  //  Zod validation errors
  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    const field = firstError.path.join(".");
    const message = `${field}: ${firstError.message}`;

    return ResponseHandler.validationError(message);
  }

  //  tRPC errors
  if (error instanceof TRPCError) {
    const errorCode = error.code.toUpperCase();
    return ResponseHandler.error(
      errorCode,
      error.message,
      errorCodeToHttpStatusCode[
        errorCode as keyof typeof errorCodeToHttpStatusCode
      ]
    );
  }

  //  Handle tRPC error responses (from fetchRequestHandler)
  if (error && typeof error === "object" && "error" in error) {
    const trpcError = error as {
      error: { message: string; code: number; data?: { code: string } };
    };

    // Map tRPC error codes to your error codes
    let errorCode: ErrorCodeEnumType = "internal_server_error";

    if (trpcError.error.data?.code === "METHOD_NOT_SUPPORTED") {
      errorCode = "method_not_allowed"; // 405
    } else if (trpcError.error.code === -32600) {
      errorCode = "bad_request"; // 400
    } else if (trpcError.error.code === -32601) {
      errorCode = "not_found"; // 404
    } else if (trpcError.error.code === -32602) {
      errorCode = "invalid_input"; // 400
    } else if (trpcError.error.code === -32005) {
      errorCode = "method_not_allowed"; // 405
    }

    return ResponseHandler.error(
      errorCode,
      trpcError.error.message,
      errorCodeToHttpStatusCode[errorCode]
    );
  }

  // Database errors  Drizzle ORM
  if (error && typeof error === "object" && "code" in error) {
    const dbError = error as { code: string; message?: string };

    switch (dbError.code) {
      case "P2025": // Record not found
        return ResponseHandler.error(
          errorCodeToSpeakeasyError.not_found,
          "Resource not found",
          errorCodeToHttpStatusCode.not_found
        );
      case "P2002": // Unique constraint violation
        return ResponseHandler.error(
          errorCodeToSpeakeasyError.conflict,
          "Resource already exists",
          errorCodeToHttpStatusCode.conflict
        );
      case "P2003": // Foreign key constraint
        return ResponseHandler.error(
          errorCodeToSpeakeasyError.bad_request,
          "Invalid reference",
          errorCodeToHttpStatusCode.bad_request
        );
    }
  }

  //  Custom ApiError
  if (error instanceof TRPCError) {
    return ResponseHandler.error(
      errorCodeToSpeakeasyError.internal_server_error,
      error.message,
      errorCodeToHttpStatusCode.internal_server_error
    );
  }

  //  Unknown error
  logger.error("Unhandled error:", error);
  return ResponseHandler.error(
    errorCodeToSpeakeasyError.internal_server_error,
    "An internal server error occurred. Please try again later.",
    errorCodeToHttpStatusCode.internal_server_error
  );
}

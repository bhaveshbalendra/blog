import { ErrorCodeEnumType } from "@/lib/zod/schemas/response";

export const errorCodeToSpeakeasyError: Record<ErrorCodeEnumType, string> = {
  not_found: "NotFound",
  bad_request: "BadRequest",
  unauthorized: "Unauthorized",
  forbidden: "Forbidden",
  conflict: "Conflict",
  internal_server_error: "InternalServerError",
  invalid_input: "InvalidInput",
  method_not_allowed: "MethodNotAllowed",
};

export const trpcErrorCode = {
  bad_request: "BAD_REQUEST",
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  not_found: "NOT_FOUND",
  conflict: "CONFLICT",
  invalid_input: "INVALID_INPUT",
  internal_server_error: "INTERNAL_SERVER_ERROR",
  method_not_allowed: "METHOD_NOT_ALLOWED",
};

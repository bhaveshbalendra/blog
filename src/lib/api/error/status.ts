import { ErrorCodeEnumType } from "@/lib/zod/schemas/response";

export const errorCodeToHttpStatusCode = {
  bad_request: 400,
  invalid_input: 400,
  not_found: 404,
  post_not_found: 404,
  category_not_found: 404,
  post_category_not_found: 404,
  post_category_already_exists: 409,
  internal_server_error: 500,
  conflict: 409,
  forbidden: 403,
  unprocessable_entity: 422,
  method_not_allowed: 405,
  unauthorized: 401,
  too_many_requests: 429,
};

export const httpStatusToErrorCode = Object.fromEntries(
  Object.entries(errorCodeToHttpStatusCode).map(([code, status]) => [
    status,
    code,
  ])
) as Record<number, ErrorCodeEnumType>;

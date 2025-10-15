import z from "@/lib/zod";

export const ErrorCode = z.enum([
  "bad_request",
  "not_found",
  "invalid_input",
  "internal_server_error",
  "conflict",
  "forbidden",
  "unauthorized",
  "method_not_allowed",
]);

export type ErrorCodeEnumType = z.infer<typeof ErrorCode>;

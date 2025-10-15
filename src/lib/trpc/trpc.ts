import { handleApiError } from "@/lib/api/error/error";
import { initTRPC } from "@trpc/server";
import {
  businessLogicValidationMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  sanitizationMiddleware,
  securityValidationMiddleware,
  validationMiddleware,
} from "./middleware";

const t = initTRPC.create({
  errorFormatter({ error }) {
    // Using custom error handler

    const errorResponse = handleApiError(error);

    return errorResponse;
  },
});

// public procedure (no auth required) with middleware
export const publicProcedure = t.procedure
  .use(loggingMiddleware)
  .use(sanitizationMiddleware)
  .use(securityValidationMiddleware)
  .use(validationMiddleware)
  .use(businessLogicValidationMiddleware)
  .use(rateLimitMiddleware);

// router
export const router = t.router;

import superjson from "superjson";

import { cache } from "react";

import { db } from "@/db/drizzle";
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
export const createTRPCContext = cache(() => ({ db }));

type Context = {
  db: typeof db;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ error }) {
    // Using custom error handler
    const errorResponse = handleApiError(error);

    return errorResponse;
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure
  .use(loggingMiddleware)
  .use(sanitizationMiddleware)
  .use(securityValidationMiddleware)
  .use(validationMiddleware)
  .use(businessLogicValidationMiddleware)
  .use(rateLimitMiddleware);

// export const protectedProcedure = t.procedure.use(
//   t.middleware(async ({ ctx, next }) => {
//     const session = await getSession();

//     if (!session)
//       throw new TRPCError({
//         code: "UNAUTHORIZED",
//       });

//     return next({
//       ctx: {
//         ...ctx,
//         user: session.user,
//       },
//     });
//   })
// );

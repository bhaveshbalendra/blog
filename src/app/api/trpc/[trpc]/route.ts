import { db } from "@/db/drizzle";
import { logger } from "@/lib/logger/logger";
import { appRouter } from "@/lib/trpc/server/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  return await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ db }),
    onError: ({ error, path }) => {
      logger.error(`tRPC error on path ${path}:`, error);
    },
  });
};

export { handler as GET, handler as POST };

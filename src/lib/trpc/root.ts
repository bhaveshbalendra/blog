import { router } from "@/lib/trpc/trpc";
import { categoriesRouter } from "./routers/categories";
import { postsRouter } from "./routers/posts";

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;

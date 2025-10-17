import { createTRPCRouter } from "./init";
import { categoriesRouter } from "./routers/categories";
import { postsRouter } from "./routers/posts";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;

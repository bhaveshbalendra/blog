import { db } from "@/db/drizzle";
import { categories, postCategories, posts } from "@/db/schema";
import { publicProcedure, router } from "@/lib/trpc";
import { generateSlug } from "@/lib/utils";
import { postsValidator } from "@/lib/validator";
import { and, desc, eq, ilike, or } from "drizzle-orm";

export const postsRouter = router({
  getAll: publicProcedure
    .input(postsValidator.getAll)
    .query(async ({ input }) => {
      const whereConditions = [];

      if (input.published !== undefined) {
        whereConditions.push(eq(posts.published, input.published));
      }

      if (input.search) {
        whereConditions.push(
          or(
            ilike(posts.title, `%${input.search}%`),
            ilike(posts.content, `%${input.search}%`)
          )
        );
      }

      let result;

      if (input.categoryId) {
        result = await db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            slug: posts.slug,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .innerJoin(postCategories, eq(posts.id, postCategories.postId))
          .where(
            and(
              ...whereConditions,
              eq(postCategories.categoryId, input.categoryId)
            )
          )
          .orderBy(desc(posts.createdAt));
      } else {
        result = await db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            slug: posts.slug,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .where(
            whereConditions.length > 0 ? and(...whereConditions) : undefined
          )
          .orderBy(desc(posts.createdAt));
      }

      // Get categories for each post
      const postsWithCategories = await Promise.all(
        result.map(async (post) => {
          const postCats = await db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            })
            .from(categories)
            .innerJoin(
              postCategories,
              eq(categories.id, postCategories.categoryId)
            )
            .where(eq(postCategories.postId, post.id));

          return {
            ...post,
            categories: postCats,
          };
        })
      );

      return postsWithCategories;
    }),

  getBySlug: publicProcedure
    .input(postsValidator.getBySlug)
    .query(async ({ input }) => {
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      if (!post[0]) {
        throw new Error("Post not found");
      }

      const postCats = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(categories)
        .innerJoin(postCategories, eq(categories.id, postCategories.categoryId))
        .where(eq(postCategories.postId, post[0].id));

      return {
        ...post[0],
        categories: postCats,
      };
    }),

  create: publicProcedure
    .input(postsValidator.create)
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.title);

      const [newPost] = await db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          slug,
          published: input.published,
        })
        .returning();

      // Add categories if provided
      if (input.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: newPost.id,
            categoryId,
          }))
        );
      }

      return newPost;
    }),

  update: publicProcedure
    .input(postsValidator.update)
    .mutation(async ({ input }) => {
      const updateData: Record<string, unknown> = {};

      if (input.title) {
        updateData.title = input.title;
        updateData.slug = generateSlug(input.title);
      }
      if (input.content) updateData.content = input.content;
      if (input.published !== undefined) updateData.published = input.published;
      updateData.updatedAt = new Date();

      const [updatedPost] = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, input.id))
        .returning();

      // Update categories if provided
      if (input.categoryIds !== undefined) {
        // Remove existing categories
        await db
          .delete(postCategories)
          .where(eq(postCategories.postId, input.id));

        // Add new categories
        if (input.categoryIds.length > 0) {
          await db.insert(postCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: input.id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  delete: publicProcedure
    .input(postsValidator.delete)
    .mutation(async ({ input }) => {
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),
});

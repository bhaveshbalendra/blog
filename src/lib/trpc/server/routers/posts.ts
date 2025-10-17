import { db } from "@/db/drizzle";
import { categories, postCategories, posts } from "@/db/schemas/drizzle";
import { trpcErrorCode } from "@/lib/api/error/code";
import { errorMessage } from "@/lib/api/error/message";
import { ResponseHandler } from "@/lib/api/response/response";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc/server/init";
import { generateSlug } from "@/lib/utils";
import { postsSchemas } from "@/lib/zod/schemas/post";

import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(postsSchemas.getAll.optional())
    .query(async ({ input = {} }) => {
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

      let result: Array<{
        id: string;
        title: string;
        content: string;
        slug: string;
        published: boolean | null;
        createdAt: Date;
        updatedAt: Date;
      }> = [];

      if (input.categoryIds && input.categoryIds.length > 0) {
        // Use a subquery to find posts that have any of the selected categories
        const postsWithCategories = await db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(inArray(postCategories.categoryId, input.categoryIds));

        const postIds = postsWithCategories.map((p) => p.postId);
        if (postIds.length === 0) {
          // No posts found with the selected categories
          result = [];
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
            .where(and(...whereConditions, inArray(posts.id, postIds)))
            .orderBy(desc(posts.createdAt));
        }
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
      // const postsWithCategories = await Promise.all(
      //   result.map(async (post) => {
      //     const postCats = await db
      //       .select({
      //         id: categories.id,
      //         name: categories.name,
      //         slug: categories.slug,
      //       })
      //       .from(categories)
      //       .innerJoin(
      //         postCategories,
      //         eq(categories.id, postCategories.categoryId)
      //       )
      //       .where(eq(postCategories.postId, post.id));

      //     return {
      //       ...post,
      //       categories: postCats,
      //     };
      //   })
      // );

      // return postsWithCategories;
      return ResponseHandler.retrieved(
        result,
        errorMessage.posts_retrieved_successfully
      );
    }),

  getBySlug: publicProcedure
    .input(postsSchemas.getBySlug)
    .query(async ({ input }) => {
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      if (!post[0]) {
        throw new TRPCError({
          code: trpcErrorCode.not_found as TRPCError["code"],
          message: errorMessage.post_not_found,
        });
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

      return ResponseHandler.retrieved(
        {
          ...post[0],
          categories: postCats,
        },
        errorMessage.post_retrieved_successfully
      );
    }),

  getById: publicProcedure
    .input(postsSchemas.getById)
    .query(async ({ input }) => {
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!post[0]) {
        throw new TRPCError({
          code: trpcErrorCode.not_found as TRPCError["code"],
          message: errorMessage.post_not_found,
        });
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

      return ResponseHandler.retrieved(
        {
          ...post[0],
          categories: postCats,
        },
        errorMessage.post_retrieved_successfully
      );
    }),

  create: publicProcedure
    .input(postsSchemas.create)
    .mutation(async ({ input }) => {
      // Simple validation
      const data = postsSchemas.create.parse(input);

      // Check if slug exists
      const slug = generateSlug(data.title);

      const existingPost = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      if (existingPost.length > 0) {
        throw new TRPCError({
          code: trpcErrorCode.conflict as TRPCError["code"],
          message: errorMessage.post_already_exists,
        });
      }

      // Create post
      const [newPost] = await db
        .insert(posts)
        .values({
          title: data.title,
          content: data.content,
          slug,
          published: false,
        })
        .returning();

      return ResponseHandler.created(
        newPost,
        errorMessage.post_created_successfully
      );
    }),

  update: publicProcedure
    .input(postsSchemas.update)
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

      return ResponseHandler.updated(
        updatedPost,
        errorMessage.post_updated_successfully
      );
    }),

  delete: publicProcedure
    .input(postsSchemas.delete)
    .mutation(async ({ input }) => {
      // First, check if the post exists
      const existingPost = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (existingPost.length === 0) {
        throw new TRPCError({
          code: trpcErrorCode.not_found as TRPCError["code"],
          message: errorMessage.post_not_found,
        });
      }

      // Delete related records first (postCategories)
      await db
        .delete(postCategories)
        .where(eq(postCategories.postId, input.id));

      // Then delete the post
      await db.delete(posts).where(eq(posts.id, input.id));

      return ResponseHandler.deleted(errorMessage.post_deleted_successfully);
    }),
});

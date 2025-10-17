import { db } from "@/db/drizzle";
import { categories, postCategories } from "@/db/schemas/drizzle";
import { trpcErrorCode } from "@/lib/api/error/code";
import { errorMessage } from "@/lib/api/error/message";
import { ResponseHandler } from "@/lib/api/response/response";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc/server/init";
import { generateSlug } from "@/lib/utils";
import { categoriesSchemas } from "@/lib/zod/schemas/categories";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const categoriesData = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));

    return ResponseHandler.retrieved(
      categoriesData,
      errorMessage.categories_retrieved_successfully
    );
  }),

  getBySlug: publicProcedure
    .input(categoriesSchemas.getBySlug)
    .query(async ({ input }) => {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);

      if (!category[0]) {
        throw new TRPCError({
          code: trpcErrorCode.not_found as TRPCError["code"],
          message: errorMessage.category_not_found,
        });
      }

      return ResponseHandler.retrieved(
        category[0],
        errorMessage.category_retrieved_successfully
      );
    }),

  create: publicProcedure
    .input(categoriesSchemas.create)
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.name);

      const existingCategory = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      if (existingCategory.length > 0) {
        throw new TRPCError({
          code: trpcErrorCode.conflict as TRPCError["code"],
          message: errorMessage.category_already_exists,
        });
      }

      const [newCategory] = await db
        .insert(categories)
        .values({
          name: input.name,
          description: input.description,
          slug,
        })
        .returning();

      return ResponseHandler.created(
        newCategory,
        errorMessage.category_created_successfully
      );
    }),

  update: publicProcedure
    .input(categoriesSchemas.update)
    .mutation(async ({ input }) => {
      const updateData: Record<string, unknown> = {};

      if (input.name) {
        updateData.name = input.name;
        updateData.slug = generateSlug(input.name);
      }
      if (input.description !== undefined)
        updateData.description = input.description;
      updateData.updatedAt = new Date();

      const [updatedCategory] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id))
        .returning();

      return ResponseHandler.updated(
        updatedCategory,
        errorMessage.category_updated_successfully
      );
    }),

  delete: publicProcedure
    .input(categoriesSchemas.delete)
    .mutation(async ({ input }) => {
      const existingCategory = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (existingCategory.length === 0) {
        throw new TRPCError({
          code: trpcErrorCode.not_found as TRPCError["code"],
          message: errorMessage.category_not_found,
        });
      }

      await db
        .delete(postCategories)
        .where(eq(postCategories.categoryId, input.id));

      await db.delete(categories).where(eq(categories.id, input.id));
      return ResponseHandler.deleted(
        errorMessage.category_deleted_successfully
      );
    }),
});

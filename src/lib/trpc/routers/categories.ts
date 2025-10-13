import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { publicProcedure, router } from "@/lib/trpc";
import { generateSlug } from "@/lib/utils";
import { categoriesValidator } from "@/lib/validator";
import { desc, eq } from "drizzle-orm";

export const categoriesRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));
  }),

  getBySlug: publicProcedure
    .input(categoriesValidator.getBySlug)
    .query(async ({ input }) => {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);

      if (!category[0]) {
        throw new Error("Category not found");
      }

      return category[0];
    }),

  create: publicProcedure
    .input(categoriesValidator.create)

    .mutation(async ({ input }) => {
      const slug = generateSlug(input.name);

      const [newCategory] = await db
        .insert(categories)
        .values({
          name: input.name,
          description: input.description,
          slug,
        })
        .returning();

      return newCategory;
    }),

  update: publicProcedure
    .input(categoriesValidator.update)
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

      return updatedCategory;
    }),

  delete: publicProcedure
    .input(categoriesValidator.delete)
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});

import z from "@/lib/zod";

export const categoriesSchemas = {
  getBySlug: z.object({
    slug: z.string(),
  }),
  create: z.object({
    name: z.string(),
    description: z.string(),
  }),
  update: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  }),
  delete: z.object({
    id: z.string(),
  }),
};

export type CategoriesSchemasType = z.infer<typeof categoriesSchemas>;

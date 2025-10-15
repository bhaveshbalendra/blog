import z from "@/lib/zod";

// Posts Validator
export const postsSchemas = {
  getBySlug: z.object({
    slug: z.string(),
  }),
  create: z.object({
    title: z.string(),
    content: z.string(),
  }),
  update: z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
    categoryIds: z.array(z.string()),
  }),
  delete: z.object({
    id: z.string(),
  }),
  getAll: z.object({
    published: z.boolean().optional(),
    categoryId: z.string().optional(),
    search: z.string().optional(),
  }),
  getById: z.object({
    id: z.string(),
  }),
  getByCategoryId: z.object({
    categoryId: z.string(),
  }),
  getBySearch: z.object({
    search: z.string(),
  }),
  getByPublished: z.object({
    published: z.boolean(),
  }),
  getByCategoryIdAndPublished: z.object({
    categoryId: z.string(),
    published: z.boolean(),
  }),
  getBySearchAndPublished: z.object({
    search: z.string(),
    published: z.boolean(),
  }),
  getByCategoryIdAndSearchAndPublished: z.object({
    categoryId: z.string(),
    search: z.string(),
    published: z.boolean(),
  }),
  getByCategoryIdAndSearchAndPublishedAndPage: z.object({
    categoryId: z.string(),
    search: z.string(),
    published: z.boolean(),
  }),
};

export type PostsSchemasType = z.infer<typeof postsSchemas>;

import z from "@/lib/zod";

// Form validation schema for post creation/editing
export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim()
    .refine((val) => val.length > 0, "Title cannot be empty"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10,000 characters")
    .trim()
    .refine((val) => val.length > 0, "Content cannot be empty"),
  published: z.boolean(),
  categoryIds: z
    .array(z.string().uuid("Invalid category ID"))
    .default([])
    .optional(),
});

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
    categoryIds: z.array(z.string()).optional(), // Changed from single categoryId to array
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

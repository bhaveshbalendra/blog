import { z } from "zod";
// Categories Validator
export const categoriesValidator = {
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

// Posts Validator
export const postsValidator = {
  getBySlug: z.object({
    slug: z.string(),
  }),
  create: z.object({
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
    categoryIds: z.array(z.string()),
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
    published: z.boolean(),
    categoryId: z.string(),
    search: z.string(),
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

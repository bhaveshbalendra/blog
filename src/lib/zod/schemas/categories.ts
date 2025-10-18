import z from "@/lib/zod";

// Form validation schema for category creation/editing
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .trim()
    .refine((val) => val.length > 0, "Name cannot be empty"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .trim()
    .optional(),
});

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

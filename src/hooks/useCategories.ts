import { trpc } from "@/lib/trpc/client/index";

export function useCategories() {
  return trpc.categories.getAll.useQuery();
}

export function useCategory(slug: string) {
  return trpc.categories.getBySlug.useQuery({ slug });
}

export function useCreateCategory() {
  const utils = trpc.useUtils();

  return trpc.categories.create.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate();
    },
  });
}

export function useUpdateCategory() {
  const utils = trpc.useUtils();

  return trpc.categories.update.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate();
    },
  });
}

export function useDeleteCategory() {
  const utils = trpc.useUtils();

  return trpc.categories.delete.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate();
    },
  });
}

"use client";

import { trpc } from "@/lib/trpc/client/index";

// Query hooks
export function usePosts() {
  return trpc.posts.getAll.useQuery();
}

export function usePost(idOrSlug: string) {
  // Check if the parameter is a UUID (ID) or a slug
  const isId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

  if (isId) {
    return trpc.posts.getById.useQuery({ id: idOrSlug });
  } else {
    return trpc.posts.getBySlug.useQuery({ slug: idOrSlug });
  }
}

export function usePostsWithFilters(filters: {
  search?: string;
  categoryIds?: string[];
  published?: boolean;
}) {
  return trpc.posts.getAll.useQuery(filters);
}

// Mutation hooks
export function useCreatePost() {
  const utils = trpc.useUtils();

  return trpc.posts.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch posts
      utils.posts.getAll.invalidate();
    },
  });
}

export function useUpdatePost() {
  const utils = trpc.useUtils();

  return trpc.posts.update.useMutation({
    onSuccess: () => {
      // Invalidate posts list
      utils.posts.getAll.invalidate();
    },
  });
}

export function useDeletePost() {
  const utils = trpc.useUtils();

  return trpc.posts.delete.useMutation({
    onSuccess: () => {
      // Invalidate posts list
      utils.posts.getAll.invalidate();
    },
  });
}

// Utility hooks
export function usePostUtils() {
  const utils = trpc.useUtils();

  return {
    invalidatePosts: () => utils.posts.getAll.invalidate(),
    invalidatePost: (slug: string) =>
      utils.posts.getBySlug.invalidate({ slug }),
    refetchPosts: () => utils.posts.getAll.refetch(),
    refetchPost: (slug: string) => utils.posts.getBySlug.refetch({ slug }),
  };
}

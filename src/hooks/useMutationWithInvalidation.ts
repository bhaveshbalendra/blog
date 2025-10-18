"use client";

import { trpc } from "@/lib/trpc/client/index";

interface InvalidationKey {
  router: string;
  procedure: string;
  params?: Record<string, unknown>;
}

/**
 * Generic hook for mutations with automatic cache invalidation
 * Eliminates repetitive invalidation patterns across the codebase
 */
export function useMutationWithInvalidation<TData, TVariables>(
  mutationPath: string,
  invalidateKeys: InvalidationKey[],
  options?: {
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
    onError?: (error: Error, variables: TVariables, context: unknown) => void;
  }
) {
  const utils = trpc.useUtils();

  // Get the mutation function dynamically from tRPC client
  const [router, procedure] = mutationPath.split(".");

  // Use type assertion to access the mutation
  const mutation = (
    trpc as unknown as Record<
      string,
      Record<
        string,
        {
          useMutation: (opts?: {
            onSuccess?: (
              data: TData,
              variables: TVariables,
              context: unknown
            ) => void;
            onError?: (
              error: Error,
              variables: TVariables,
              context: unknown
            ) => void;
          }) => unknown;
        }
      >
    >
  )[router][procedure];

  return mutation.useMutation({
    ...options,
    onSuccess: (data: TData, variables: TVariables, context: unknown) => {
      // Invalidate specified keys
      invalidateKeys.forEach(({ router, procedure, params }) => {
        const utilsRouter = utils[router as keyof typeof utils] as Record<
          string,
          { invalidate: (params?: Record<string, unknown>) => void }
        >;
        if (params) {
          utilsRouter[procedure].invalidate(params);
        } else {
          utilsRouter[procedure].invalidate();
        }
      });

      // Call original onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  }) as {
    mutateAsync: (variables: TVariables) => Promise<TData>;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
  };
}

/**
 * Pre-configured hooks for common patterns
 */
export const usePostMutation = (procedure: "create" | "update" | "delete") => {
  return useMutationWithInvalidation(`posts.${procedure}`, [
    { router: "posts", procedure: "getAll" },
  ]);
};

export const useCategoryMutation = (
  procedure: "create" | "update" | "delete"
) => {
  return useMutationWithInvalidation(`categories.${procedure}`, [
    { router: "categories", procedure: "getAll" },
  ]);
};

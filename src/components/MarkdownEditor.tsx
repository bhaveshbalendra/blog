"use client";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useCreatePost, useUpdatePost } from "@/hooks/usePosts";
import { usePostFormStore } from "@/lib/store/forms/postForm";
import { useUIStore } from "@/lib/store/ui";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  postId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialPublished?: boolean;
  initialCategoryIds?: string[];
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  postId,
  initialTitle = "",
  initialContent = "",
  initialPublished = false,
  initialCategoryIds = [],
}) => {
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const { data: categories } = useCategories();
  const { closeCreatePostModal, closeEditPostModal } = useUIStore();
  const router = useRouter();

  const {
    formData,
    isSubmitting,
    errors,
    updateField,
    validateForm,
    resetForm,
    setSubmitting,
    clearErrors,
    updateFormData,
  } = usePostFormStore();

  // Initialize form data if editing
  useEffect(() => {
    if (postId && (initialTitle || initialContent)) {
      updateFormData({
        title: initialTitle,
        content: initialContent,
        published: initialPublished,
        categoryIds: initialCategoryIds,
      });
    }
  }, [
    postId,
    initialTitle,
    initialContent,
    initialPublished,
    initialCategoryIds,
    updateFormData,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    clearErrors();

    try {
      if (postId) {
        // Update existing post
        await updatePostMutation.mutateAsync({
          id: postId,
          title: formData.title,
          content: formData.content,
          published: formData.published,
          categoryIds: formData.categoryIds,
        });
        closeEditPostModal();
        router.push("/dashboard");
      } else {
        // Create new post
        await createPostMutation.mutateAsync({
          title: formData.title,
          content: formData.content,
        });
        closeCreatePostModal();
        router.push("/dashboard");
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContentChange = (value?: string) => {
    updateField("content", value || "");
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategoryIds = checked
      ? [...formData.categoryIds, categoryId]
      : formData.categoryIds.filter((id) => id !== categoryId);

    updateField("categoryIds", newCategoryIds);
  };

  const isError = createPostMutation.isError || updatePostMutation.isError;
  const errorMessage =
    createPostMutation.error?.message || updatePostMutation.error?.message;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {postId ? "Edit Post" : "Create New Post"}
        </h2>
        <p className="text-gray-600 mt-1">
          {postId
            ? "Update your post content"
            : "Write your post using markdown"}
        </p>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Post Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter post title"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Categories */}
        {categories?.data && categories.data.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.data.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={(e) =>
                      handleCategoryChange(category.id, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Published Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={(e) => updateField("published", e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-700"
          >
            Publish immediately
          </label>
        </div>

        {/* Markdown Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content (Markdown)
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <MDEditor
              value={formData.content}
              onChange={handleContentChange}
              height={400}
              data-color-mode="light"
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              if (postId) {
                closeEditPostModal();
              } else {
                closeCreatePostModal();
              }
            }}
            disabled={
              isSubmitting ||
              createPostMutation.isPending ||
              updatePostMutation.isPending
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              createPostMutation.isPending ||
              updatePostMutation.isPending ||
              !formData.title.trim() ||
              !formData.content.trim()
            }
          >
            {isSubmitting ||
            createPostMutation.isPending ||
            updatePostMutation.isPending
              ? "Saving..."
              : postId
              ? "Update Post"
              : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MarkdownEditor;

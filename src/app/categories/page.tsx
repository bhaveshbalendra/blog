"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryMutation } from "@/hooks/useMutationWithInvalidation";
import { useCategoryFormStore } from "@/lib/store/forms/categoryForm";
import { useUIStore } from "@/lib/store/ui";
import React, { useState } from "react";

const CategoriesPage: React.FC = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();

  const createCategoryMutation = useCategoryMutation("create");
  const updateCategoryMutation = useCategoryMutation("update");
  const deleteCategoryMutation = useCategoryMutation("delete");

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    deleteCategoryModalOpen,
    selectedCategoryId,
    openDeleteCategoryModal,
    closeDeleteCategoryModal,
  } = useUIStore();

  const {
    formData,
    errors,
    isValid,
    isSubmitting,
    updateField,
    updateFormData,
    validateForm,
    resetForm,
    setSubmitting,
  } = useCategoryFormStore();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createCategoryMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
      });

      resetForm();
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !editingId) return;

    setSubmitting(true);
    try {
      await updateCategoryMutation.mutateAsync({
        id: editingId,
        name: formData.name,
        description: formData.description,
      });

      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryMutation.mutateAsync({ id: categoryId });
      closeDeleteCategoryModal();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const startEdit = (category: {
    id: string;
    name: string;
    description?: string | null;
  }) => {
    setEditingId(category.id);
    updateFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const cancelCreate = () => {
    setIsCreating(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <LoadingSpinner message="Loading categories..." fullScreen />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay
            title="Error loading categories"
            error={error}
            onRetry={() => refetch()}
            retryText="Try Again"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">Manage your blog categories</p>
            </div>
            <Button onClick={() => setIsCreating(true)}>Create Category</Button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? "Edit Category" : "Create New Category"}
            </h2>

            <form
              onSubmit={editingId ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter category name"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={editingId ? cancelEdit : cancelCreate}
                  disabled={
                    createCategoryMutation.isPending ||
                    updateCategoryMutation.isPending
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    createCategoryMutation.isPending ||
                    updateCategoryMutation.isPending ||
                    !isValid
                  }
                >
                  {createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending
                    ? "Saving..."
                    : editingId
                    ? "Update Category"
                    : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              All Categories
            </h2>
          </div>

          {!categories?.data || categories.data.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No categories
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new category.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsCreating(true)}>
                  Create Category
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.data.map((category) => (
                <div key={category.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {category.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Created:{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(category)}
                        disabled={editingId === category.id}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteCategoryModal(category.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={deleteCategoryMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCategoryModalOpen && selectedCategoryId && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 text-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">
                  Delete Category
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={closeDeleteCategoryModal}
                disabled={deleteCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteCategory(selectedCategoryId)}
                disabled={deleteCategoryMutation.isPending}
              >
                {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

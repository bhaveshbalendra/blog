"use client";

import MarkdownDisplay from "@/components/MarkdownDisplay";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { usePostsWithFilters } from "@/hooks/usePosts";
import { useSearchStore } from "@/lib/store/search";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BlogPage: React.FC = () => {
  const { data: categories } = useCategories();
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const {
    query,
    filters,
    currentPage,
    pageSize,
    setQuery,
    updateFilter,
    toggleCategory,
    clearFilters,
    resetSearch,
    setPage,
    nextPage,
    prevPage,
  } = useSearchStore();

  // Debounce the search input with 500ms delay
  const debouncedSearch = useDebounce(searchInput, 500);

  // Update the actual query when debounced search changes
  useEffect(() => {
    setQuery(debouncedSearch);
  }, [debouncedSearch, setQuery]);

  // Use server-side filtering with debounced search
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
  } = usePostsWithFilters({
    search: query || undefined,
    categoryIds:
      filters.categoryIds &&
      Array.isArray(filters.categoryIds) &&
      filters.categoryIds.length > 0
        ? filters.categoryIds
        : undefined,
    published: true, // Only show published posts
  });

  const filteredPosts = posts?.data || [];

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
  }, [query, filters, setPage]);

  // Initialize search input with current query
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">
            Discover our latest articles and insights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Posts
                {searchInput !== query && (
                  <span className="ml-2 text-xs text-gray-500">
                    (searching...)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search posts..."
                />
                {searchInput !== query && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
                {filters.categoryIds &&
                  Array.isArray(filters.categoryIds) &&
                  filters.categoryIds.length > 0 && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {filters.categoryIds &&
                        Array.isArray(filters.categoryIds) &&
                        filters.categoryIds.length}{" "}
                      selected
                    </span>
                  )}
              </label>
              {/* Category Search */}
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearchTerm}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                />
              </div>

              {/* Categories Grid/List */}
              <div className="border border-gray-300 rounded-md p-2">
                {(() => {
                  const filteredCategories =
                    categories?.data?.filter((category) =>
                      category.name
                        .toLowerCase()
                        .includes(categorySearchTerm.toLowerCase())
                    ) || [];

                  return filteredCategories.length > 3 ? (
                    // Grid layout for many categories
                    <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                      {filteredCategories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={
                              filters.categoryIds &&
                              Array.isArray(filters.categoryIds) &&
                              filters.categoryIds.includes(category.id)
                            }
                            onChange={() => toggleCategory(category.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span
                            className="text-gray-700 truncate"
                            title={category.name}
                          >
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    // List layout for few categories
                    <div className="space-y-1">
                      {filteredCategories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              filters.categoryIds &&
                              Array.isArray(filters.categoryIds) &&
                              filters.categoryIds.includes(category.id)
                            }
                            onChange={() => toggleCategory(category.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })()}

                {/* Clear all button */}
                {filters.categoryIds &&
                  Array.isArray(filters.categoryIds) &&
                  filters.categoryIds.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <button
                        type="button"
                        onClick={() => updateFilter("categoryIds", [])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear all categories
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {paginatedPosts.length} of {filteredPosts.length} posts
            </div>
            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Posts Section */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8">
            <LoadingSpinner message="Loading posts..." />
          </div>
        ) : isError ? (
          <ErrorDisplay
            title="Error loading blog posts"
            error={error}
            onRetry={() => refetch()}
            retryText="Try Again"
          />
        ) : paginatedPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No posts found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {query ||
              (filters.categoryIds &&
                Array.isArray(filters.categoryIds) &&
                filters.categoryIds.length > 0)
                ? "Try adjusting your search or filters."
                : "No blog posts have been published yet."}
            </p>
            {(query ||
              (filters.categoryIds &&
                Array.isArray(filters.categoryIds) &&
                filters.categoryIds.length > 0)) && (
              <div className="mt-6">
                <Button onClick={resetSearch}>Clear Search</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-8">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <time className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <div className="prose max-w-none">
                    <MarkdownDisplay
                      content={post.content.substring(0, 200) + "..."}
                      className="text-gray-600"
                    />
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;

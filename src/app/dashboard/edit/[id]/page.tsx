"use client";

import MarkdownEditor from "@/components/MarkdownEditor";
import Navigation from "@/components/Navigation";
import { usePost } from "@/hooks/usePosts";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const EditPostPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { data: post, isLoading, isError, error } = usePost(postId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading post...</span>
        </div>
      </div>
    );
  }

  if (isError || !post?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
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
                <h3 className="text-sm font-medium text-red-800">
                  Error loading post
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {error?.message ||
                      "An error occurred while loading the post"}
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard">
                    <button className="bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded-md text-sm">
                      Back to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
              <p className="text-gray-600 mt-1">Update your blog post</p>
            </div>
            <Link href="/dashboard">
              <button className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-md text-sm">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow">
          <MarkdownEditor
            postId={post.data.id}
            initialTitle={post.data.title}
            initialContent={post.data.content}
            initialPublished={post.data.published ?? false}
            initialCategoryIds={[]} // You'll need to implement category assignment
          />
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;

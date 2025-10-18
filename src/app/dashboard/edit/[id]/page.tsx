"use client";

import MarkdownEditor from "@/components/MarkdownEditor";
import Navigation from "@/components/Navigation";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { usePost } from "@/hooks/usePosts";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const EditPostPage: React.FC = () => {
  const params = useParams();
  const postId = params.id as string;

  const { data: post, isLoading, isError, error } = usePost(postId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <LoadingSpinner message="Loading post..." fullScreen />
      </div>
    );
  }

  if (isError || !post?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay
            title="Error loading post"
            error={error}
            className="mb-4"
          />
          <Link href="/dashboard">
            <button className="bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded-md text-sm">
              Back to Dashboard
            </button>
          </Link>
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

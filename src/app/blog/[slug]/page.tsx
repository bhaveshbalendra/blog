"use client";

import MarkdownDisplay from "@/components/MarkdownDisplay";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { usePost } from "@/hooks/usePosts";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const PostPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, isError, error, refetch } = usePost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <LoadingSpinner message="Loading post..." fullScreen />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay
            title="Error loading post"
            error={error}
            onRetry={() => refetch()}
            retryText="Try Again"
          />
        </div>
      </div>
    );
  }

  if (!post || !post.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
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
              Post not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The post you&apos;re looking for doesn&apos;t exist.
            </p>
            <div className="mt-6">
              <Link href="/blog">
                <Button>Back to Blog</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline" size="sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <article className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <div className="text-sm text-gray-500">
                <time dateTime={post.data.createdAt.toString()}>
                  {new Date(post.data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {post.data.title}
            </h1>

            {/* Categories */}
            {post.data.categories && post.data.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.data.categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Post Content */}
            <div className="prose max-w-none">
              <MarkdownDisplay content={post.data.content} />
            </div>
          </div>
        </article>

        {/* Simple Back Navigation */}
        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button variant="outline">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostPage;

"use client";

import MarkdownEditor from "@/components/MarkdownEditor";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import React from "react";

const CreatePostPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Post
              </h1>
              <p className="text-gray-600 mt-1">Write a new blog post</p>
            </div>
            <Link href="/dashboard">
              <button className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-md text-sm">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-white rounded-lg shadow">
          <MarkdownEditor />
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;

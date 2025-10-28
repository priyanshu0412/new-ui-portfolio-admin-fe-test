"use client";
import React, { useState } from "react";
import ListBlogReuseCard from "./listBlogReuseCard";
import BlogForm from "./blogForm";

// ------------------------------------

const BlogPageComponent = () => {

    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 sm:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-b border-gray-200 pb-3 gap-4 md:gap-0">
                    <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                        Blog Management
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                        Create Blog
                    </button>
                </div>

                {/* Conditional Form Section */}
                {showForm && (
                    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
                        <BlogForm onCancel={() => setShowForm(false)} />
                    </div>
                )}

                {/* Blog List Section */}
                <div className="flex flex-col gap-4">
                    <ListBlogReuseCard />
                </div>
            </div>

        </>
    );
};

export default BlogPageComponent;

// UI DONE 
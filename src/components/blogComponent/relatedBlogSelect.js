"use client";
import Image from "next/image";
import React from "react";

// -------------------------------------------------

const RelatedBlogSelect = ({
    relatedBlogs = [],
    loadingRelatedBlog = false,
    formData,
    setFormData,
}) => {
    const handleRelatedChange = (e) => {
        const selectedOptions = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value,
        );
        setFormData({ ...formData, relatedBlogs: selectedOptions });
    };

    return (
        <>
            <div>
                <label className="block font-medium mb-1 text-gray-700">Related Blogs</label>

                <div className="relative">
                    <select
                        multiple
                        name="relatedBlogs"
                        value={formData.relatedBlogs}
                        onChange={handleRelatedChange}
                        className="w-full h-56 border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none overflow-y-auto transition"
                    >
                        {loadingRelatedBlog ? (
                            <option disabled>Loading...</option>
                        ) : (
                            relatedBlogs.map((ele) => (
                                <option
                                    key={ele._id}
                                    value={ele._id}
                                    className="py-2 px-3 border-b last:border-none"
                                >
                                    {ele.title} — {ele.authorName} ({ele.readTime} min)
                                </option>
                            ))
                        )}
                    </select>

                    <p className="text-xs text-gray-500 mt-1">
                        Hold <kbd className="px-1 py-0.5 font-sans font-semibold bg-gray-200 rounded border border-gray-300">Ctrl</kbd> (Windows) or{' '}
                        <kbd className="px-1 py-0.5 font-sans font-semibold bg-gray-200 rounded border border-gray-300">Cmd</kbd> (Mac) to select multiple blogs
                    </p>
                </div>

                {/* Selected blog preview */}
                {formData.relatedBlogs?.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Selected Blogs:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {relatedBlogs
                                .filter((b) => formData.relatedBlogs.includes(b._id))
                                .map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 shadow-sm bg-gray-50"
                                    >
                                        <Image
                                            height={300}
                                            width={300}
                                            src={blog.thumbnailImg}
                                            alt={blog.title}
                                            className="w-14 h-14 rounded-lg object-cover border border-gray-300"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{blog.title}</span>
                                            <span className="text-xs text-gray-600">
                                                {blog.authorName} • {blog.readTime} min read
                                            </span>
                                            <span className="text-xs text-blue-500">
                                                {blog.category.map((c) => c.name).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RelatedBlogSelect;

// UI DONE 

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FetchApi } from "@/utilities";
import Icon from "../icon"

// -------------------------------------------------------

const ListBlogReuseCard = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // ---------------- Fetch Blogs ----------------
    const getBlogs = async () => {
        try {
            const res = await FetchApi({ url: "/blog", method: "GET" });
            if (res.success && res.data?.data) {
                setBlogs(res.data.data);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        router.push(`/manage-blog/${id}`);
    };

    // inside your component
    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this blog?");
        if (!ok) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Missing auth token. Please login again.");
                return;
            }
            // If your FetchApi supports token param, pass it; else add headers manually
            const res = await FetchApi({
                url: `/blog/${id}`,
                method: "DELETE",
                token, // your helper adds Authorization: Bearer <token>
            });

            // Success can be 200 OK or 204 No Content
            if (res.success) {
                // Remove from UI
                setBlogs((prev) => prev.filter((b) => b._id !== id));
            } else {
                const msg =
                    typeof res.data?.message === "string"
                        ? res.data.message
                        : "Failed to delete blog";
                alert(msg);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Something went wrong while deleting.");
        }
    };

    useEffect(() => {
        getBlogs();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <h1 className="text-3xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
                    <Icon icon="mdi:book-open-page-variant-outline" className="w-7 h-7 text-blue-600 flex justify-center items-center" />
                    Blog List
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-70"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No blogs found.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div
                                    className="h-52 w-full relative cursor-pointer group"
                                    onClick={() => router.push(`/blog/${blog.slug}`)}
                                >
                                    <Image
                                        src={
                                            blog.thumbnailImg ||
                                            'https://via.placeholder.com/500x300?text=No+Image'
                                        }
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Blog Info */}
                                <div className="flex flex-col justify-between flex-1 p-5">
                                    <div>
                                        <h2
                                            onClick={() => router.push(`/blog/${blog.slug}`)}
                                            className="text-xl font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 cursor-pointer"
                                        >
                                            {blog.title}
                                        </h2>

                                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                                            {blog.desc}
                                        </p>

                                        {/* Author and Read Time */}
                                        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Icon icon="mdi:account-outline" className="w-4 h-4 flex justify-center items-center text-gray-500" />
                                                {blog.authorName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Icon icon="mdi:clock-outline" className="w-4 h-4 flex justify-center items-center text-gray-500" />
                                                {blog.readTime} min read
                                            </span>
                                        </div>

                                        {/* Categories */}
                                        {blog.category?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {blog.category.map((cat) => (
                                                    <span
                                                        key={cat._id}
                                                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100"
                                                    >
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Tags */}
                                        {blog.tags?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {blog.tags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-5 flex justify-between">
                                        <button
                                            onClick={() => handleEdit(blog._id)}
                                            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ListBlogReuseCard;

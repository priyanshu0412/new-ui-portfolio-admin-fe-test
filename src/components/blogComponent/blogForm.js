"use client";
import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { FetchApi } from "@/utilities";
import RelatedBlogSelect from "./relatedBlogSelect";
import Image from "next/image";

// ------------------------------------

const BlogForm = ({ onCancel, existingData = {}, isEditMode = false }) => {
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        date: "",
        readTime: "",
        isFeatured: false,
        category: "",
        tags: "",
        shareLink: "",
        thumbnailImg: null,
        relatedBlogs: [],
        authorName: "",
        authorDesc: "",
        authorGithubLink: "",
        authorPortfolioLink: "",
        authorOtherProfileLink: "",
        content: "",
    });

    const [categories, setCategories] = useState([]);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingRelatedBlog, setLoadingRelatedBlog] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
    const [thumbnailPreview, setThumbnailPreview] = useState(null); // New state for image preview URL

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setFormData({ ...formData, [name]: file });

            // Create and set image preview URL
            if (file) {
                const previewURL = URL.createObjectURL(file);
                setThumbnailPreview(previewURL);
            } else {
                setThumbnailPreview(null);
            }
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    // Cleanup the preview URL when the component unmounts or a new file is selected
    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    useEffect(() => {
        if (isEditMode && existingData) {
            if (
                existingData.thumbnailImg &&
                typeof existingData.thumbnailImg === "string"
            ) {
                setThumbnailPreview(existingData.thumbnailImg);
            }
        }
        // eslint-disable-next-line
    }, [existingData]);

    const handleEditorChange = (content) => {
        setFormData({ ...formData, content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not authenticated. Please login again.");
                setIsSubmitting(false);
                return;
            }

            const form = new FormData();

            Object.keys(formData).forEach((key) => {
                const value = formData[key];

                if (key === "date") return;

                if (key === "thumbnailImg" && value instanceof File) {
                    form.append("thumbnailImg", value);
                } else if (Array.isArray(value)) {
                    form.append(key, value.join(","));
                } else {
                    form.append(key, value);
                }
            });

            // Append date once properly
            if (formData.date) {
                form.append("date", new Date(formData.date).toISOString());
            }
            const method = isEditMode ? "PUT" : "POST";
            const url = isEditMode ? `/blog/${existingData._id}` : "/blog";

            const res = await FetchApi({
                url,
                method,
                data: form,
                token,
                contentType: "multipart/form-data",
            });

            if (res?.success) {
                alert(
                    isEditMode
                        ? "✅ Blog updated successfully!"
                        : "✅ Blog created successfully!",
                );
                if (onCancel) onCancel();
            } else {
                alert(res?.message || "Failed to save blog");
            }
        } catch (error) {
            console.error("🚨 Error submitting blog:", error);
            alert("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await FetchApi({ url: "/blogCategory", method: "GET" });
            setCategories(res?.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setCategories([]);
        }
        setLoadingCategories(false);
    };

    const fetchRelatedBlogs = async () => {
        try {
            const res = await FetchApi({ url: "/blog", method: "GET" });
            setRelatedBlogs(res?.data?.data || []);
        } catch (err) {
            console.error("Error fetching related blogs:", err);
            setRelatedBlogs([]);
        }
        setLoadingRelatedBlog(false);
    };

    useEffect(() => {
        fetchCategories();
        fetchRelatedBlogs();
    }, []);

    useEffect(() => {
        if (isEditMode && existingData) {
            setFormData({
                ...formData,
                ...existingData,
                category: Array.isArray(existingData.category)
                    ? existingData.category[0]?._id || ""
                    : existingData.category?._id || existingData.category || "",
                date: existingData.date
                    ? new Date(existingData.date).toISOString().split("T")[0]
                    : "",
                tags: Array.isArray(existingData.tags)
                    ? existingData.tags.join(", ")
                    : existingData.tags || "",
                relatedBlogs: existingData.relatedBlogs?.map((b) => b._id) || [],
            });
        }
        // eslint-disable-next-line
    }, [existingData]);

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-5xl mx-auto space-y-8"
            >
                {/* HEADER */}
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-1">
                        Create New Blog
                    </h2>
                    <p className="text-gray-500">
                        Fill out the details below to create a new blog post.
                    </p>
                </div>

                {/* BASIC BLOG DETAILS */}
                <section className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Blog Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter blog title"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">
                                Published Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">
                                Read Time (mins)
                            </label>
                            <input
                                type="number"
                                name="readTime"
                                value={formData.readTime}
                                onChange={handleChange}
                                placeholder="e.g. 5"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-gray-700">
                            Short Description
                        </label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            placeholder="Enter short description"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 resize-none focus:ring focus:ring-blue-300 focus:outline-none transition"
                            required
                        />
                    </div>
                </section>

                {/* BLOG CONTENT */}
                <section className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Blog Content
                    </h3>
                    <Editor
                        apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                        value={formData.content}
                        init={{
                            height: 600,
                            menubar: "file edit view insert format tools table help",
                            skin: "oxide",
                            content_css: "default",
                            plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "help",
                                "wordcount",
                                "emoticons",
                                "codesample",
                                "pagebreak",
                                "nonbreaking",
                                "directionality",
                            ],
                            toolbar: [
                                "undo redo | blocks fontselect fontsizeselect | " +
                                "bold italic underline strikethrough forecolor backcolor | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | " +
                                "blockquote subscript superscript | " +
                                "link image media table emoticons codesample charmap | " +
                                "removeformat code preview fullscreen",
                            ].join(" "),
                            toolbar_mode: "sliding",
                            branding: false,
                            elementpath: false,
                            content_style: `
          body {
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            line-height: 1.7;
            color: #1f2937;
            background-color: #ffffff;
            padding: 1.5rem;
          }
          h1, h2, h3, h4, h5, h6 {
            font-weight: 700;
            color: #111827;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          p {
            margin-bottom: 1rem;
          }
          a {
            color: #2563eb;
            text-decoration: underline;
          }
          blockquote {
            border-left: 4px solid #60a5fa;
            padding-left: 1rem;
            color: #374151;
            font-style: italic;
            background: #f3f4f6;
            border-radius: 0.375rem;
          }
          code {
            background: #f9fafb;
            color: #d97706;
            padding: 2px 5px;
            border-radius: 0.25rem;
            font-family: 'Fira Code', monospace;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
          }
          table, th, td {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
          }
        `,
                        }}
                        onEditorChange={handleEditorChange}
                    />
                </section>

                {/* CATEGORIES & TAGS */}
                <section className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Categorization
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                                required
                            >
                                <option value="">Select category</option>
                                {loadingCategories ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g. react, javascript (comma separated)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                            />
                        </div>

                        <RelatedBlogSelect
                            relatedBlogs={relatedBlogs}
                            loadingRelatedBlog={loadingRelatedBlog}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </section>

                {/* IMAGE + FEATURED */}
                <section className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Media & Links
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium mb-1 text-gray-700">
                                Thumbnail Image
                            </label>
                            <input
                                type="file"
                                name="thumbnailImg"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                            />
                            {formData.thumbnailImg && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Selected: {formData.thumbnailImg.name}
                                </p>
                            )}

                            {/* Image Preview */}
                            {thumbnailPreview && (
                                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2">
                                    <p className="text-sm font-semibold mb-2 text-gray-700">Image Preview:</p>
                                    <Image
                                        width={300}
                                        height={300}
                                        src={thumbnailPreview}
                                        alt="Thumbnail Preview"
                                        className="w-full h-auto max-h-64 object-contain rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Share Link</label>
                            <input
                                type="url"
                                name="shareLink"
                                value={formData.shareLink}
                                onChange={handleChange}
                                placeholder="https://example.com/share"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="mr-2 w-5 h-5 accent-blue-600"
                        />
                        <label className="font-medium text-gray-700">Mark this blog as Featured</label>
                    </div>
                </section>

                {/* AUTHOR DETAILS */}
                <section className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Author Details</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Author Name</label>
                            <input
                                type="text"
                                name="authorName"
                                value={formData.authorName}
                                onChange={handleChange}
                                placeholder="Enter author name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Author Bio</label>
                            <textarea
                                name="authorDesc"
                                value={formData.authorDesc}
                                onChange={handleChange}
                                placeholder="Short author bio"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring focus:ring-blue-300 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">GitHub Link</label>
                            <input
                                type="url"
                                name="authorGithubLink"
                                value={formData.authorGithubLink}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Portfolio Link</label>
                            <input
                                type="url"
                                name="authorPortfolioLink"
                                value={formData.authorPortfolioLink}
                                onChange={handleChange}
                                placeholder="https://portfolio.com"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block font-medium mb-1 text-gray-700">Other Profile (LinkedIn / X / etc.)</label>
                            <input
                                type="url"
                                name="authorOtherProfileLink"
                                value={formData.authorOtherProfileLink}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none transition"
                            />
                        </div>
                    </div>
                </section>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    ></path>
                                </svg>
                                {isEditMode ? "Updating..." : "Creating..."}
                            </>
                        ) : isEditMode ? (
                            "Update Blog"
                        ) : (
                            "Create Blog"
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};

export default BlogForm;

// UI DONE 
"use client";
import React, { useEffect, useState } from "react";
import { FetchApi } from "@/utilities";
import BlogForm from "../blogComponent/blogForm";

// -------------------------------------------------------

const BlogSpecificComponent = ({ blogId }) => {
    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBlog = async () => {
        try {
            const res = await FetchApi({ url: `/blog/${blogId}`, method: "GET" });
            setBlogData(res?.data.data);
        } catch (err) {
            console.error("Error fetching blog:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
        // eslint-disable-next-line
    }, [blogId]);

    if (loading)
        return <p className="text-center py-10 text-gray-600">Loading...</p>;
    if (!blogData)
        return <p className="text-center py-10 text-red-500">Blog not found!</p>;

    return (
        <>
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
                    <BlogForm existingData={blogData} isEditMode={true} />
                </div>
            </div>

        </>
    );
};

export default BlogSpecificComponent;
// UI Done 

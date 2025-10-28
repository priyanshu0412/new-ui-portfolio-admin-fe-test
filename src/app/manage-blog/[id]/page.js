import React from "react";
import { BlogSpecificComponent, ProtectedRoute } from "@/components";

// --------------------------------------

const SpecificBlogPage = async ({ params }) => {

    const { id } = await params;

    return (
        <>
            <ProtectedRoute>
                <BlogSpecificComponent blogId={id} />;
            </ProtectedRoute>
        </>
    )
};

export default SpecificBlogPage;

// UI DONE 

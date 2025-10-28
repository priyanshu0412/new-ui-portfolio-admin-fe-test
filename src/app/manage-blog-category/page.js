import React from "react";
import { BlogCategoryComponent, ProtectedRoute } from "@/components";

// ----------------------------------------

const ManageBlogCategoryPage = () => {
    return (
        <>
            <ProtectedRoute>
                <BlogCategoryComponent />
            </ProtectedRoute>
        </>
    );
};

export default ManageBlogCategoryPage;

// UI DONE 

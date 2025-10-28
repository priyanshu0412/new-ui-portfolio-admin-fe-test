import { BlogPageComponent, ProtectedRoute } from "@/components";
import React from "react";

// -------------------------------------------

const ManageBlogPage = () => {
    return (
        <>
            <ProtectedRoute>
                <BlogPageComponent />
            </ProtectedRoute>
        </>
    );
};

export default ManageBlogPage;

// UI DONE 

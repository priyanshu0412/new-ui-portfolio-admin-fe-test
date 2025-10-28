import { ProjectPageComponent, ProtectedRoute } from "@/components";
import React from "react";

// --------------------------------------

const ManageProjectPage = () => {
    return (
        <>
            <ProtectedRoute>
                <ProjectPageComponent />
            </ProtectedRoute>
        </>
    );
};

export default ManageProjectPage;

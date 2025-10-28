import React from "react";
import { ExpPageComponent, ProtectedRoute } from "@/components";

// ------------------------------------------

const ManageExperiencePage = () => {
    return (
        <>
            <ProtectedRoute>
                <ExpPageComponent />
            </ProtectedRoute>
        </>
    );
};

export default ManageExperiencePage;

// UI Done 



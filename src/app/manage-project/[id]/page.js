import { ProjectSpecificPageComponent, ProtectedRoute } from "@/components";
import React from "react";

// -------------------------------------

const SpecificProjectPage = ({ params }) => {
    return (
        <>
            <ProtectedRoute>
                <ProjectSpecificPageComponent projectId={params.id} />
            </ProtectedRoute>
        </>
    );
};

export default SpecificProjectPage;

// UI DONE 

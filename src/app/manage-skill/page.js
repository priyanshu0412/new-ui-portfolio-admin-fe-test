import { ProtectedRoute, SkillPageComponent } from "@/components";
import React from "react";

// -------------------------------------

const ManageSkillPage = () => {
    return (
        <>
            <ProtectedRoute>
                <SkillPageComponent />
            </ProtectedRoute>
        </>
    );
};

export default ManageSkillPage;

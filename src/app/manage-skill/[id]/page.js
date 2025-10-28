import React from "react";
import { ProtectedRoute, SkillSpecificComponent } from "@/components";

// ---------------------------------------

const SpecificSkillPage = async ({ params }) => {
    const { id } = await params;

    return (
        <>
            <ProtectedRoute>
                <SkillSpecificComponent id={id} />
            </ProtectedRoute>
        </>
    );
};

export default SpecificSkillPage;

// UI DONE 

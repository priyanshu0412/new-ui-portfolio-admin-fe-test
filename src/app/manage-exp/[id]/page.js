import React from "react";
import { ExpSpecificComponent, ProtectedRoute } from "@/components";

// --------------------------------------

const SpecificExpPage = () => {
    return (
        <>
            <ProtectedRoute>
                <ExpSpecificComponent />
            </ProtectedRoute>
        </>
    );
};

export default SpecificExpPage;

// UI DONE 

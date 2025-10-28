"use client";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// ---------------------------------------------

const PublicRoute = ({ children }) => {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);

    return <>{children}</>;
};

export default PublicRoute;

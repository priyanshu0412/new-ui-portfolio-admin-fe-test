"use client";
import React, { useEffect, useState } from "react";
import { FetchApi } from "@/utilities";
import ProjectCardReuse from "./projectCardReuse";
import CreateProjectForm from "./createProjectForm";
import Icon from "../icon";

// -----------------------------------------------------

const ProjectPageComponent = () => {

    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Fetch projects
    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        const { status, success, data } = await FetchApi({ url: "/project" });
        if (success) {
            setProjects(data.projects || []);
        } else {
            setError(data.message || `Failed to fetch projects, status: ${status}`);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handlers for edit/delete can be added here

    // When new project created, add it to projects list and hide form
    const handleProjectCreated = (newProject) => {
        setProjects((prev) => [newProject, ...prev]);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
                    Projects
                </h1>

                {/* Create Button */}
                <div className="flex justify-center mb-10">
                    {!showCreateForm && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
                        >
                            <Icon icon="mdi:plus-circle-outline" className="w-5 h-5 flex justify-center items-center" />
                            Create Project
                        </button>
                    )}
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="max-w-4xl mx-auto mb-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 transition-all">
                        <CreateProjectForm
                            onClose={() => setShowCreateForm(false)}
                            onProjectCreated={handleProjectCreated}
                        />
                    </div>
                )}

                {/* Loading and Error States */}
                {loading && (
                    <div className="text-center text-gray-600 mt-10">
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600 mb-4"></div>
                        </div>
                        Loading projects...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500 font-medium mt-10">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && projects.length === 0 && (
                    <p className="text-center text-gray-500 mt-10 text-lg">
                        No projects found.
                    </p>
                )}

                {/* Projects Grid */}
                {!loading && !error && projects.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((ele) => (
                            <div
                                key={ele._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow hover:shadow-2xl transition-all duration-300"
                            >
                                <ProjectCardReuse project={ele} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProjectPageComponent;

// UI DONE 
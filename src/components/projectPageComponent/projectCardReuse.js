"use client";
import { FetchApi } from "@/utilities";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ----------------------------------------

const ProjectCardReuse = ({ project }) => {
    const router = useRouter();

    const handleEdit = (projectId) => {
        router.push(`/manage-project/${projectId}`);
    };

    const handleDelete = async (projectId) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("Are you sure you want to delete this project?"))
            return;

        try {
            const res = await FetchApi({
                url: `/project/${projectId}`,
                method: "DELETE",
                token,
            });
        } catch (err) {
            alert("Error deleting project");
        }
    };

    return (
        <>
            <div
                key={project._id}
                className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col bg-white"
            >
                <Image
                    width={300}
                    height={300}
                    src={project.thumbnailImg || "/placeholder.png"}
                    alt={project.title}
                    className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{project.title}</h2>
                <p className="text-gray-700 mb-3 flex-grow">
                    {project.desc.length > 120 ? project.desc.slice(0, 120) + "..." : project.desc}
                </p>
                <div className="mb-2 text-sm text-gray-600">
                    <strong>Category:</strong> {project.category} | <strong>Client:</strong> {project.client || "N/A"}
                </div>
                <div className="mb-3 text-sm text-gray-600">
                    <strong>Tech Used:</strong> {project.techUsed?.join(", ") || "N/A"}
                </div>
                <div className="mb-4 text-sm text-gray-600">
                    <strong>Completed On:</strong>{" "}
                    {new Date(project.completeDate).toLocaleDateString() || "N/A"}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="bg-purple-200 text-purple-800 rounded-full px-3 py-0.5 text-xs font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex space-x-3 mt-auto">
                    <a
                        href={project.livePreviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        View Live
                    </a>
                    <button
                        onClick={() => handleEdit(project._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(project._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProjectCardReuse;

// UI DONE  

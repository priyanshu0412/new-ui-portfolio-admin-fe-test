"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FetchApi } from "@/utilities";
import SkillCategoryCard from "./skillCategoryCard";
import CreateSkillSetForm from "./createSkillSetForm";

// ------------------------------------------------

const SkillPageComponent = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    // Fetch All Skills
    const fetchSkills = async () => {
        try {
            const res = await FetchApi({ url: "/skills", method: "GET" });
            if (res.success) setCategories(res.data);
        } catch (error) {
            console.error("Fetch Skills Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    // Create New Skill Category
    const handleCreateCategory = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!newCategory.trim()) {
            Swal.fire("Warning", "Category name cannot be empty!", "warning");
            return;
        }

        try {
            const res = await FetchApi({
                url: "/skills",
                method: "POST",
                token,
                body: { category: newCategory },
            });

            if (res.success) {
                Swal.fire(
                    "Created!",
                    "New skill category added successfully.",
                    "success",
                );
                setCategories((prev) => [...prev, res.data]);
                setNewCategory("");
                setShowForm(false);
            } else {
                Swal.fire(
                    "Error",
                    res.message || "Failed to create category.",
                    "error",
                );
            }
        } catch (error) {
            console.error("Create Category Error:", error);
            Swal.fire(
                "Error",
                "Something went wrong while creating category.",
                "error",
            );
        }
    };

    // Edit
    const handleEditCategory = (id) => {
        router.push(`manage-skill/${id}`);
    };

    // Delete
    const handleDeleteCategory = async (id) => {
        const token = localStorage.getItem("token");

        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the category and its skills!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const res = await FetchApi({
                url: `/skills/${id}`,
                method: "DELETE",
                token,
            });

            if (res.success) {
                Swal.fire("Deleted!", "Category deleted successfully.", "success");
                setCategories((prev) => prev.filter((cat) => cat._id !== id));
            } else {
                Swal.fire(
                    "Error",
                    res.message || "Failed to delete category.",
                    "error",
                );
            }
        } catch (error) {
            console.error("Delete Category Error:", error);
            Swal.fire(
                "Error",
                "Something went wrong while deleting category.",
                "error",
            );
        }
    };

    // Loading State
    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Loading…
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-6">
            {/* Heading */}
            <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
                Skills & Categories
            </h1>

            {/* Create Button */}
            <div className="max-w-6xl mx-auto flex justify-end mb-10">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200"
                >
                    {/* Optional icon — uncomment if needed */}
                    {/* <Icon icon={showForm ? "mdi:close" : "mdi:plus"} className="w-5 h-5" /> */}
                    {showForm ? "Close Form" : "Create New Skill Set"}
                </button>
            </div>

            {/* Skill Form */}
            {showForm && (
                <div className="max-w-5xl mx-auto mb-10 bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                    <CreateSkillSetForm
                        onClose={() => setShowForm(false)}
                        onCreated={fetchSkills}
                    />
                </div>
            )}

            {/* Skill Categories */}
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <SkillCategoryCard
                            key={cat._id}
                            category={cat}
                            onEditCategory={handleEditCategory}
                            onDeleteCategory={handleDeleteCategory}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-14 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                        No categories found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillPageComponent;

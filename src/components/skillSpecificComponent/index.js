"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FetchApi } from "@/utilities";
import Icon from "@/components/icon";
import Swal from "sweetalert2";


// ------------------------------------------

const SkillSpecificComponent = ({ id }) => {

    const levelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState({
        name: "",
        icon: "",
        level: "Beginner",
    });
    const token = localStorage.getItem("token");

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (id) fetchCategoryData();
        // eslint-disable-next-line
    }, [id]);

    const fetchCategoryData = async () => {
        try {
            const res = await FetchApi({ url: `/skills/${id}`, method: "GET" });
            if (res.success && res.data) setCategory(res.data);
            else if (res.category) setCategory(res);
        } catch (err) {
            console.error("Fetch Category Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // -------------------- CATEGORY UPDATE --------------------
    const handleCategoryUpdate = async () => {
        try {
            const res = await FetchApi({
                url: `/skills/category/${id}`,
                method: "PATCH",
                data: { category: category.category },
                token,
            });

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "Category Updated!",
                    text: "The category has been successfully updated ✅",
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchCategoryData();
            }
        } catch (err) {
            console.error("Update Category Error:", err);
            Swal.fire("Error", "Something went wrong while updating!", "error");
        }
    };

    // -------------------- ADD SKILL --------------------

    const handleAddSkill = async () => {
        if (!newSkill.name || !newSkill.icon)
            return Swal.fire("Missing Fields", "Please fill all fields!", "warning");

        try {
            const res = await FetchApi({
                url: `/skills/createSkill/${id}`,
                method: "POST",
                data: { skills: [{ ...newSkill }] },
                token,
            });

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "Skill Added!",
                    text: "New skill added successfully ✅",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setNewSkill({ name: "", icon: "", level: "Beginner" });
                fetchCategoryData();
            }
        } catch (err) {
            console.error("Add Skill Error:", err);
            Swal.fire("Error", "Unable to add skill ❌", "error");
        }
    };

    // -------------------- UPDATE SKILL --------------------

    const handleUpdateSkill = async (skillId, updatedSkill) => {
        try {
            const res = await FetchApi({
                url: `/skills/${skillId}`,
                method: "PATCH",
                data: updatedSkill,
                token,
            });

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "Skill Updated!",
                    text: "Skill updated successfully ✅",
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchCategoryData();
            }
        } catch (err) {
            console.error("Update Skill Error:", err);
            Swal.fire("Error", "Something went wrong while updating skill!", "error");
        }
    };

    // -------------------- DELETE SKILL --------------------

    const handleDeleteSkill = async (skillId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the skill.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await FetchApi({
                url: `/skills/deleteSkill/${skillId}`,
                method: "DELETE",
                token,
            });

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Skill deleted successfully 🗑️",
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchCategoryData();
            }
        } catch (err) {
            console.error("Delete Skill Error:", err);
            Swal.fire("Error", "Failed to delete skill ❌", "error");
        }
    };

    // -------------------- DELETE CATEGORY --------------------

    const handleDeleteCategory = async () => {
        const result = await Swal.fire({
            title: "Delete Category?",
            text: "This will remove the category and all its skills!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await FetchApi({
                url: `/skills/${id}`,
                method: "DELETE",
                token,
            });

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "Category Deleted!",
                    text: "Category and all skills removed ✅",
                    timer: 1500,
                    showConfirmButton: false,
                });
                router.push("/manage-skill");
            } else {
                Swal.fire(
                    "Error",
                    res.message || "Failed to delete category ❌",
                    "error",
                );
            }
        } catch (error) {
            console.error("Delete Category Error:", error);
            Swal.fire(
                "Error",
                "Something went wrong while deleting category ⚠️",
                "error",
            );
        }
    };

    if (!mounted) return null;
    if (loading)
        return (
            <div className="text-center py-12 text-gray-600 text-lg font-medium">
                Loading...
            </div>
        );
    if (!category)
        return (
            <div className="text-center py-12 text-red-600 text-lg font-semibold">
                Category not found.
            </div>
        );

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-6">
                {/* Header */}
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                    <button
                        onClick={() => router.push("/manage-skill")}
                        className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition-all"
                        aria-label="Back to manage skill"
                    >
                        <Icon icon="mdi:arrow-left" className="w-5 h-5 flex justify-center items-center" />
                        Back to Categories
                    </button>

                    <button
                        onClick={handleDeleteCategory}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all"
                    >
                        <Icon icon="mdi:delete-outline" className="w-5 h-5 flex justify-center items-center" />
                        Delete Category
                    </button>
                </div>

                {/* Category Update Card */}
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-end gap-6 mb-12">
                    <div className="flex-1 w-full">
                        <label
                            htmlFor="categoryName"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Category Name
                        </label>
                        <input
                            id="categoryName"
                            type="text"
                            placeholder="Enter category name"
                            value={category.category || ""}
                            onChange={(e) => setCategory({ ...category, category: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none transition"
                            aria-label="Category Name"
                        />
                    </div>

                    <button
                        onClick={handleCategoryUpdate}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-sm transition-all duration-200"
                    >
                        Update
                    </button>
                </div>

                {/* Add Skill Section */}
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">Add New Skill</h3>
                        <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Skill Name */}
                        <div>
                            <label
                                htmlFor="skillName"
                                className="text-sm font-medium text-gray-700 mb-2 block"
                            >
                                Skill Name
                            </label>
                            <input
                                id="skillName"
                                type="text"
                                placeholder="e.g. React JS"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 bg-gray-50 text-gray-700 placeholder-gray-400 outline-none transition"
                            />
                        </div>

                        {/* Skill Icon */}
                        <div>
                            <label
                                htmlFor="skillIcon"
                                className="text-sm font-medium text-gray-700 mb-2 block"
                            >
                                Icon Name
                            </label>
                            <input
                                id="skillIcon"
                                type="text"
                                placeholder="e.g. logos:react"
                                value={newSkill.icon}
                                onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 bg-gray-50 text-gray-700 placeholder-gray-400 outline-none transition"
                            />
                        </div>

                        {/* Skill Level */}
                        <div>
                            <label
                                htmlFor="skillLevel"
                                className="text-sm font-medium text-gray-700 mb-2 block"
                            >
                                Proficiency Level
                            </label>
                            <select
                                id="skillLevel"
                                value={newSkill.level}
                                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 bg-gray-50 text-gray-700 outline-none cursor-pointer transition"
                            >
                                {levelOptions.map((lvl) => (
                                    <option key={lvl}>{lvl}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleAddSkill}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold tracking-wide px-6 py-3 rounded-lg shadow-sm transition-all duration-200"
                        >
                            <Icon icon="mdi:plus-circle-outline" className="w-5 h-5 flex justify-center items-center" />
                            Add Skill
                        </button>
                    </div>
                </div>

                {/* Skill Cards */}
                <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
                    {category.skills?.map((skill) => (
                        <div
                            key={skill._id}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {skill.name || "Untitled Skill"}
                                </h3>
                                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                                    {skill.level}
                                </span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Skill Name */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                                        Skill Name
                                    </label>
                                    <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) =>
                                            setCategory({
                                                ...category,
                                                skills: category.skills.map((s) =>
                                                    s._id === skill._id ? { ...s, name: e.target.value } : s
                                                ),
                                            })
                                        }
                                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                                        placeholder="Enter skill name..."
                                    />
                                </div>

                                {/* Icon */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                                        Icon (e.g. logos:react)
                                    </label>
                                    <input
                                        type="text"
                                        value={skill.icon}
                                        onChange={(e) =>
                                            setCategory({
                                                ...category,
                                                skills: category.skills.map((s) =>
                                                    s._id === skill._id ? { ...s, icon: e.target.value } : s
                                                ),
                                            })
                                        }
                                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                                        placeholder="Icon name..."
                                    />
                                </div>

                                {/* Level */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                                        Proficiency Level
                                    </label>
                                    <select
                                        value={skill.level}
                                        onChange={(e) =>
                                            setCategory({
                                                ...category,
                                                skills: category.skills.map((s) =>
                                                    s._id === skill._id ? { ...s, level: e.target.value } : s
                                                ),
                                            })
                                        }
                                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-full"
                                    >
                                        {levelOptions.map((lvl) => (
                                            <option key={lvl}>{lvl}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleUpdateSkill(skill._id, skill)}
                                    className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-lg font-semibold transition"
                                >
                                    <Icon icon="mdi:content-save-outline" className="w-5 h-5" />
                                    Save
                                </button>
                                <button
                                    onClick={() => handleDeleteSkill(skill._id)}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2 rounded-lg font-semibold transition"
                                >
                                    <Icon icon="mdi:delete-outline" className="w-5 h-5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SkillSpecificComponent;

// UI DONE 
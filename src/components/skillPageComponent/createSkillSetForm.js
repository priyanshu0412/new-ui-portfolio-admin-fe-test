"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { FetchApi } from "@/utilities";

// -------------------------------------------

const CreateSkillSetForm = ({ onClose, onCreated }) => {

    const levelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

    const [category, setCategory] = useState("");
    const [skills, setSkills] = useState([
        { name: "", icon: "", level: "Beginner" },
    ]);

    const handleSkillChange = (index, field, value) => {
        const updated = [...skills];
        updated[index][field] = value;
        setSkills(updated);
    };

    const handleAddSkill = () => {
        setSkills([...skills, { name: "", icon: "", level: "Beginner" }]);
    };

    const handleRemoveSkill = (index) => {
        const updated = skills.filter((_, i) => i !== index);
        setSkills(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!category.trim()) {
            Swal.fire("Warning", "Category name is required.", "warning");
            return;
        }

        if (skills.some((s) => !s.name || !s.icon)) {
            Swal.fire("Warning", "Please fill all skill fields.", "warning");
            return;
        }

        try {
            const res = await FetchApi({
                url: "/skills/create",
                method: "POST",
                token,
                data: { category, skills },
            });

            if (res.success) {
                Swal.fire("Created!", "New skill set created successfully.", "success");
                setCategory("");
                setSkills([{ name: "", icon: "", level: "Beginner" }]);
                onCreated?.();
                onClose?.();
            } else {
                Swal.fire(
                    "Error",
                    res.message || "Failed to create skill set.",
                    "error",
                );
            }
        } catch (error) {
            console.error("Create Skill Set Error:", error);
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-12"
        >
            {/* Header */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                {/* Optional icon */}
                {/* <Icon icon="mdi:hammer-wrench" className="text-indigo-600 w-6 h-6" /> */}
                Create New Skill Set
            </h2>

            {/* Category Input */}
            <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                    Category Name
                </label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category name..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none placeholder-gray-400"
                />
            </div>

            {/* Skill Inputs */}
            <div className="space-y-6">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="p-5 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <input
                                type="text"
                                value={skill.name}
                                onChange={(e) =>
                                    handleSkillChange(index, "name", e.target.value)
                                }
                                placeholder="Skill name"
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none placeholder-gray-400"
                            />

                            <input
                                type="text"
                                value={skill.icon}
                                onChange={(e) =>
                                    handleSkillChange(index, "icon", e.target.value)
                                }
                                placeholder="Icon name (e.g., mdi:react)"
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none placeholder-gray-400"
                            />

                            <select
                                value={skill.level}
                                onChange={(e) =>
                                    handleSkillChange(index, "level", e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
                            >
                                {levelOptions.map((lvl) => (
                                    <option key={lvl}>{lvl}</option>
                                ))}
                            </select>
                        </div>

                        {skills.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(index)}
                                className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-600 transition"
                            >
                                {/* <Icon icon="mdi:trash-can-outline" className="w-4 h-4" /> */}
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition"
                >
                    {/* <Icon icon="mdi:plus-circle-outline" className="w-5 h-5" /> */}
                    Add Skill
                </button>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CreateSkillSetForm;

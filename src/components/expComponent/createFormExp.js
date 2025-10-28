"use client";
import React, { useEffect, useState } from "react";
import Icon from "../icon";
import { FetchApi } from "@/utilities";
import Swal from "sweetalert2";
import ExpListComponent from "./expListComponent";

// -----------------------------------------

const CreateFormExp = () => {
    const [experiences, setExperiences] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        designation: "",
        company: "",
        desc: "",
        startYear: "",
        endYear: "",
        keyAchievement: "",
        learn: "",
    });

    // -------------------------- Fetch all experiences --------------------------
    const fetchExperiences = async () => {
        try {
            const res = await FetchApi({ url: "/exp" });
            if (res.success) {
                setExperiences(res.data);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: res.data?.message || "Could not fetch experiences.",
                    confirmButtonColor: "#d33",
                });
            }
        } catch (err) {
            console.error("Error fetching experiences:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while fetching experiences.",
                confirmButtonColor: "#d33",
            });
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    // -------------------------- Delete experience --------------------------
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token)
            return Swal.fire({
                icon: "warning",
                title: "Unauthorized!",
                text: "You must be logged in to perform this action.",
            });

        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const res = await FetchApi({
                url: `/exp/${id}`,
                method: "DELETE",
                token,
            });

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: res.data.message || "Experience deleted successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchExperiences();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: res.data.message || "Delete failed.",
                });
            }
        } catch (err) {
            console.error("Delete Error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while deleting.",
            });
        }
    };

    // Handle form change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // -------------------------- Create Experience --------------------------
    const handleCreate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token)
            return Swal.fire({
                icon: "warning",
                title: "Unauthorized!",
                text: "You must be logged in to add an experience.",
            });

        const payload = {
            ...formData,
            keyAchievement: formData.keyAchievement.split(",").map((s) => s.trim()),
            learn: formData.learn.split(",").map((s) => s.trim()),
        };

        try {
            const res = await FetchApi({
                url: "/exp/create",
                method: "POST",
                data: payload,
                token,
            });

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "Added!",
                    text: "Experience added successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setFormData({
                    designation: "",
                    company: "",
                    desc: "",
                    startYear: "",
                    endYear: "",
                    keyAchievement: "",
                    learn: "",
                });
                setFormVisible(false);
                fetchExperiences();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: res.data.message || "Failed to add experience.",
                });
            }
        } catch (err) {
            console.error("Create Error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while adding the experience.",
            });
        }
    };
    return (
        <>
            <div className="max-w-5xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    Manage Experiences
                </h1>

                {/* Toggle Button */}
                <div className="flex justify-center mb-10">
                    <button
                        onClick={() => setFormVisible(!formVisible)}
                        className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 ${formVisible
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        aria-expanded={formVisible}
                        aria-controls="experience-form"
                    >
                        <Icon
                            icon={
                                formVisible
                                    ? "mdi:close-circle-outline"
                                    : "mdi:plus-circle-outline"
                            }
                            className="w-6 h-6 flex justify-center items-center"
                        />
                        {formVisible ? "Cancel" : "Add New Experience"}
                    </button>
                </div>

                {/* Experience Form */}
                {formVisible && (
                    <form
                        onSubmit={handleCreate}
                        id="experience-form"
                        className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 space-y-6 transition-all duration-300"
                        noValidate
                    >
                        {/* Inputs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="Designation"
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                            />
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Company"
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                            />
                        </div>

                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            placeholder="Description"
                            rows={3}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input
                                type="text"
                                name="startYear"
                                value={formData.startYear}
                                onChange={handleChange}
                                placeholder="Start Year"
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                            />
                            <input
                                type="text"
                                name="endYear"
                                value={formData.endYear}
                                onChange={handleChange}
                                placeholder="End Year (or leave empty for Present)"
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <textarea
                            name="keyAchievement"
                            value={formData.keyAchievement}
                            onChange={handleChange}
                            placeholder="Key Achievements (comma separated)"
                            rows={2}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />

                        <textarea
                            name="learn"
                            value={formData.learn}
                            onChange={handleChange}
                            placeholder="Learnings (comma separated)"
                            rows={2}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setFormVisible(false)}
                                className="bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-6 py-3 shadow-md transition-all duration-300"
                            >
                                <Icon icon="mdi:content-save-outline" className="w-6 h-6 flex justify-center items-center" />
                                Save Experience
                            </button>
                        </div>
                    </form>
                )}

                {/* Experience List */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {experiences.length === 0 ? (
                        <p className="text-gray-500 text-lg col-span-full text-center">
                            No experiences found.
                        </p>
                    ) : (
                        experiences.map((exp) => (
                            <div
                                key={exp._id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                <ExpListComponent exp={exp} onDelete={handleDelete} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default CreateFormExp;

// UI DONE 
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { FetchApi } from "@/utilities";

// -------------------------------------

const ExpSpecificComponent = () => {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        designation: "",
        company: "",
        desc: "",
        startYear: "",
        endYear: "",
        keyAchievement: "",
        learn: "",
    });

    const [loading, setLoading] = useState(true);

    // ---------------- Fetch experience by ID ----------------
    useEffect(() => {
        const fetchExp = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/exp/${id}`);
                const data = await res.json();
                setFormData({
                    ...data,
                    keyAchievement: data.keyAchievement.join(", "),
                    learn: data.learn.join(", "),
                });
            } catch (err) {
                console.error("Error fetching experience:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExp();
    }, [id]);

    // ---------------- Handle input change ----------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ---------------- Handle update ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return alert("Unauthorized");

        const payload = {
            ...formData,
            keyAchievement: formData.keyAchievement.split(",").map((s) => s.trim()),
            learn: formData.learn.split(",").map((s) => s.trim()),
        };

        try {
            const res = await FetchApi({
                url: `/exp/${id}`,
                method: "PATCH",
                data: payload,
                token,
            });

            alert(res.message || "Experience updated successfully ✅");
            router.push("/manage-exp");
        } catch (err) {
            console.error("Update Error:", err);
            alert("Something went wrong while updating!");
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-[60vh] text-gray-500">
                <Icon icon="eos-icons:loading" className="animate-spin text-4xl" />
                <span className="ml-2">Loading...</span>
            </div>
        );

    return (
        <>
            <div className="max-w-3xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
                {/* Outer Card */}
                <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/70 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Icon
                                icon="mdi:briefcase-edit-outline"
                                className="w-7 h-7 flex justify-center items-center text-blue-400"
                            />
                            Edit Experience
                        </h1>

                        <button
                            onClick={() => router.push("/manage-exp")}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/60 transition-colors duration-300 font-medium"
                        >
                            <Icon icon="mdi:arrow-left" className="w-5 h-5 flex justify-center items-center" />
                            Back
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Designation & Company */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Designation
                                </label>
                                <input
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="e.g., Frontend Developer"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Company
                                </label>
                                <input
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="e.g., Google"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                placeholder="Describe your role and responsibilities..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Start & End Year */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Start Year
                                </label>
                                <input
                                    name="startYear"
                                    value={formData.startYear}
                                    onChange={handleChange}
                                    placeholder="e.g., 2020"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    End Year
                                </label>
                                <input
                                    name="endYear"
                                    value={formData.endYear}
                                    onChange={handleChange}
                                    placeholder="e.g., 2023 (or leave empty)"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Key Achievements */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Key Achievements
                            </label>
                            <textarea
                                name="keyAchievement"
                                value={formData.keyAchievement}
                                onChange={handleChange}
                                placeholder="Separate with commas, e.g., Increased traffic by 50%, Improved UX"
                                rows={2}
                                className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Learnings */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Learnings
                            </label>
                            <textarea
                                name="learn"
                                value={formData.learn}
                                onChange={handleChange}
                                placeholder="Separate with commas, e.g., Leadership, React Optimization"
                                rows={2}
                                className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700/50">
                            <button
                                type="button"
                                onClick={() => router.push("/manage-exp")}
                                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold px-5 py-2.5 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                            >
                                <Icon icon="mdi:cancel" className="w-5 h-5 flex justify-center items-center" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                            >
                                <Icon icon="mdi:content-save-outline" className="w-5 h-5 flex justify-center items-center" />
                                Update Experience
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ExpSpecificComponent;

// UI DONE 

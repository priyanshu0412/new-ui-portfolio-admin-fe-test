"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

// ----------------------------------

const ExpListComponent = ({ exp, onDelete }) => {
    const router = useRouter();

    return (
        <>
            <div className="xl:max-w-[520px] w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-400">{exp.designation}</h2>
                        <p className="text-gray-300 text-sm mt-1">{exp.company}</p>
                    </div>
                    <Icon
                        icon="mdi:briefcase-outline"
                        className="w-10 h-10 flex justify-center items-center text-teal-400 mt-3 sm:mt-0"
                        aria-label="Experience Icon"
                    />
                </div>

                {/* Description */}
                <p className="text-gray-200 leading-relaxed mb-5">{exp.desc}</p>

                {/* Key Achievements */}
                {exp.keyAchievement?.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-teal-300 mb-2">Key Achievements</h3>
                        <ul className="list-disc list-inside text-gray-200 space-y-1 ml-4">
                            {exp.keyAchievement.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Learnings */}
                {exp.learn?.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-teal-300 mb-2">Learnings</h3>
                        <ul className="list-disc list-inside text-gray-200 space-y-1 ml-4">
                            {exp.learn.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Timeline */}
                <div className="flex items-center justify-center text-gray-300 text-sm font-medium mb-6">
                    <span className="border border-teal-500/40 px-3 py-1 rounded-lg bg-gray-800">{exp.startYear}</span>
                    <span className="mx-3 text-teal-400 select-none">→</span>
                    <span className="border border-teal-500/40 px-3 py-1 rounded-lg bg-gray-800">{exp.endYear || "Present"}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={() => router.push(`manage-exp/${exp._id}`)}
                        className="flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 px-5 transition-all duration-300 font-semibold shadow-md"
                        aria-label="Edit Experience"
                    >
                        <Icon icon="mdi:pencil" className="w-5 h-5 flex justify-center items-center" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(exp._id)}
                        className="flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 px-5 transition-all duration-300 font-semibold shadow-md"
                        aria-label="Delete Experience"
                    >
                        <Icon icon="mdi:delete" className="w-5 h-5 flex justify-center items-center" />
                        Delete
                    </button>
                </div>
            </div>
        </>
    );
};

export default ExpListComponent;

// UI DONE 
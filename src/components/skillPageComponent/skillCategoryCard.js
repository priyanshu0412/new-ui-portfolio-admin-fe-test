"use client";
import React from "react";
import Icon from "../icon";

// -------------------------------------

const SkillCategoryCard = ({ category, onEditCategory, onDeleteCategory }) => {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-4 rounded-t-2xl">
                {/* Category Name */}
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-md flex items-center justify-center">
                        <Icon icon="mdi:folder-outline" className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-wide capitalize">
                        {category.category}
                    </h2>
                </div>

                {/* Category Actions */}
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <button
                        onClick={() => onEditCategory(category._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 active:scale-95 transition-all duration-150"
                    >
                        <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                        Edit
                    </button>

                    <button
                        onClick={() => onDeleteCategory(category._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-95 transition-all duration-150"
                    >
                        <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Skills Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {category.skills && category.skills.length > 0 ? (
                    category.skills.map((skill) => (
                        <div
                            key={skill._id}
                            className="group flex flex-col justify-between bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-blue-300 hover:shadow transition-all duration-200"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-white border border-gray-100 shadow-sm group-hover:border-blue-200">
                                    <Icon icon={skill.icon} className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 leading-snug">
                                        {skill.name}
                                    </p>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {skill.level}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm col-span-full text-center py-6">
                        No skills found in this category.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SkillCategoryCard;

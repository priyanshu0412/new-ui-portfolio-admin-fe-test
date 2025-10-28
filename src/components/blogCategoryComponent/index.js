"use client";
import React, { useEffect, useState } from "react";
import { FetchApi } from "@/utilities";
import Swal from "sweetalert2";
import Icon from "@/components/icon";

// ------------------------------------------

const BlogCategoryComponent = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // ------------------------------------------
    // Fetch All Categories
    const fetchCategories = async () => {
        setLoading(true);
        const res = await FetchApi({ url: "/blogCategory", method: "GET" });
        if (res.success) setCategories(res.data);
        else {
            Swal.fire({
                icon: "error",
                title: "Failed to fetch categories",
                timer: 1500,
                showConfirmButton: false,
            });
        }
        setLoading(false);
    };

    // ------------------------------------------
    // Handle Create / Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            return Swal.fire({
                icon: "warning",
                title: "Name is required",
                timer: 1500,
                showConfirmButton: false,
            });
        }

        setLoading(true);
        const method = editingId ? "PATCH" : "POST";
        const url = editingId ? `/blogCategory/${editingId}` : "/blogCategory";

        const res = await FetchApi({
            url,
            method,
            data: formData,
            token: localStorage.getItem("token"),
        });

        if (res.success) {
            Swal.fire({
                icon: "success",
                title: editingId ? "Category Updated!" : "Category Created!",
                showConfirmButton: false,
                timer: 1500,
            });
            setFormData({ name: "", description: "" });
            setEditingId(null);
            fetchCategories();
        } else {
            Swal.fire({
                icon: "error",
                title: res.data?.message || "Something went wrong!",
                showConfirmButton: true,
            });
        }

        setLoading(false);
    };

    // ------------------------------------------
    // Handle Delete
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563EB",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (!confirmDelete.isConfirmed) return;

        const res = await FetchApi({
            url: `/blogCategory/${id}`,
            method: "DELETE",
            token: localStorage.getItem("token"),
        });

        if (res.success) {
            Swal.fire({
                icon: "success",
                title: "Category Deleted!",
                timer: 1500,
                showConfirmButton: false,
            });
            fetchCategories();
        } else {
            Swal.fire({
                icon: "error",
                title: res.data?.message || "Delete failed!",
                showConfirmButton: true,
            });
        }
    };

    // ------------------------------------------
    // Handle Edit
    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setEditingId(category._id);

        Swal.fire({
            icon: "info",
            title: "Edit Mode Enabled",
            text: "You can now update this category",
            timer: 1200,
            showConfirmButton: false,
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <div className="max-w-6xl my-10 mx-auto p-5 sm:p-8 md:p-10 bg-white rounded-3xl shadow-lg border border-gray-100">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                    <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        <Icon icon="mdi:shape-outline" className="w-9 h-9 flex justify-center items-center text-blue-600" />
                        Manage Blog Categories
                    </h2>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ name: "", description: "" });
                        }}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                    >
                        <Icon icon="mdi:plus" className="w-5 h-5 flex justify-center items-center" />
                        New Category
                    </button>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6"
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter category name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter category description"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-60 shadow-md"
                        >
                            <Icon
                                icon={editingId ? "mdi:content-save-outline" : "mdi:plus"}
                                className="w-5 h-5 flex justify-center items-center"
                            />
                            {editingId ? "Update Category" : "Add Category"}
                        </button>
                    </div>
                </form>

                {/* Table Section */}
                <div className="mt-10 bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-800 uppercase tracking-wide">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-800 uppercase tracking-wide">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-800 text-right uppercase tracking-wide">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            Loading categories...
                                        </td>
                                    </tr>
                                ) : categories.length > 0 ? (
                                    categories.map((cat, i) => (
                                        <tr
                                            key={cat._id || i}
                                            className="border-t border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">
                                                {cat.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {cat.description || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors flex justify-center items-center"
                                                    aria-label="Edit category"
                                                >
                                                    <Icon
                                                        icon="mdi:pencil-outline"
                                                        className="text-blue-700"
                                                        width={22}
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors flex justify-center items-center"
                                                    aria-label="Delete category"
                                                >
                                                    <Icon
                                                        icon="mdi:delete-outline"
                                                        className="text-red-600"
                                                        width={22}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No categories found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogCategoryComponent;

// UI DONE 

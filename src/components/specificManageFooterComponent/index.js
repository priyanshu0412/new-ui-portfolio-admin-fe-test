"use client";
import React, { useEffect, useState } from "react";
import { FetchApi } from "@/utilities";
import { useParams, useRouter } from "next/navigation";

// ------------------------------------------------

const SpecificManageFooterComponent = () => {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        content: "",
        location: "",
        followMeLinks: [],
        socialLinks: [],
        services: [],
    });

    // 🔹 Fetch specific footer content
    const getFooterData = async () => {
        setLoading(true);
        const res = await FetchApi({
            url: `/footerContent/${id}`,
            method: "GET",
            token,
        });
        if (res.success) {
            setFormData(res.data.data || {});
        } else {
            alert(res.data.message || "Failed to load footer content");
        }
        setLoading(false);
    };

    // 🔹 Update footer content
    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await FetchApi({
            url: `/footerContent/${id}`,
            method: "PATCH",
            data: formData,
            token,
        });
        if (res.success) {
            alert("Footer content updated successfully!");
            router.push("/manage-footer");
        } else {
            alert(res.data.message || "Failed to update footer");
        }
    };

    useEffect(() => {
        if (id) getFooterData();
        // eslint-disable-next-line
    }, [id]);

    // ------------------------------------------------
    return (
        <div className="p-6 space-y-8 text-white bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-semibold text-center sm:text-left border-b border-gray-700 pb-3">
                Edit Footer Content
            </h2>

            {loading ? (
                <p className="text-gray-400 text-center">Loading footer content...</p>
            ) : (
                <form
                    onSubmit={handleUpdate}
                    className="bg-gray-800 p-6 rounded-2xl space-y-5 border border-gray-700 shadow-lg"
                >
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    />

                    <textarea
                        placeholder="Content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        rows={4}
                        required
                    />

                    {/* Services */}
                    <div>
                        <label className="block text-gray-300 font-medium mb-1">
                            Services (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.services?.join(", ") || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    services: e.target.value.split(",").map((s) => s.trim()),
                                })
                            }
                            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Follow Me Links */}
                    <div className="space-y-3">
                        <p className="font-semibold text-gray-300 text-lg">Follow Me Links</p>
                        {formData.followMeLinks.map((link, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Icon (e.g. github)"
                                    value={link.icon || ""}
                                    onChange={(e) => {
                                        const newLinks = [...formData.followMeLinks];
                                        newLinks[idx].icon = e.target.value;
                                        setFormData({ ...formData, followMeLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="URL (e.g. https://github.com)"
                                    value={link.url || ""}
                                    onChange={(e) => {
                                        const newLinks = [...formData.followMeLinks];
                                        newLinks[idx].url = e.target.value;
                                        setFormData({ ...formData, followMeLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newLinks = formData.followMeLinks.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, followMeLinks: newLinks });
                                    }}
                                    className="bg-red-600 hover:bg-red-700 px-3 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    followMeLinks: [...formData.followMeLinks, { icon: "", url: "" }],
                                })
                            }
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                            + Add Follow Me Link
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-3">
                        <p className="font-semibold text-gray-300 text-lg">Social Links</p>
                        {formData.socialLinks.map((link, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Icon (e.g. facebook)"
                                    value={link.icon || ""}
                                    onChange={(e) => {
                                        const newLinks = [...formData.socialLinks];
                                        newLinks[idx].icon = e.target.value;
                                        setFormData({ ...formData, socialLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="URL (e.g. https://facebook.com)"
                                    value={link.url || ""}
                                    onChange={(e) => {
                                        const newLinks = [...formData.socialLinks];
                                        newLinks[idx].url = e.target.value;
                                        setFormData({ ...formData, socialLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newLinks = formData.socialLinks.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, socialLinks: newLinks });
                                    }}
                                    className="bg-red-600 hover:bg-red-700 px-3 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    socialLinks: [...formData.socialLinks, { icon: "", url: "" }],
                                })
                            }
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                            + Add Social Link
                        </button>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-end border-t border-gray-700">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold shadow transition"
                        >
                            Update Footer
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/manage-footer")}
                            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold shadow transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SpecificManageFooterComponent;

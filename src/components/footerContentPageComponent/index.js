"use client";
import React, { useEffect, useState } from "react";
import { FetchApi } from "@/utilities";
import { useRouter } from "next/navigation";

// ------------------------------------------------

const FooterContentPageComponent = () => {
    const [footerList, setFooterList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        content: "",
        location: "",
        followMeLinks: [],
        socialLinks: [],
        services: [],
    });

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const router = useRouter();

    // 🔹 Fetch all footer content
    const getFooterData = async () => {
        setLoading(true);
        const res = await FetchApi({ url: "/footerContent", method: "GET" });
        if (res.success) {
            setFooterList(res.data.data || []);
        } else {
            console.error(res.data.message);
        }
        setLoading(false);
    };

    // 🔹 Delete footer content
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this footer content?")) return;
        const res = await FetchApi({
            url: `/footerContent/${id}`,
            method: "DELETE",
            token,
        });
        if (res.success) {
            alert("Footer content deleted!");
            getFooterData();
        } else {
            alert(res.data.message || "Failed to delete");
        }
    };

    // 🔹 Create footer content
    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await FetchApi({
            url: "/footerContent",
            method: "POST",
            data: formData,
            token,
        });
        if (res.success) {
            alert("Footer created successfully!");
            setShowForm(false);
            getFooterData();
            setFormData({
                email: "",
                phone: "",
                content: "",
                location: "",
                followMeLinks: [],
                socialLinks: [],
                services: [],
            });
        } else {
            alert(res.data.message || "Failed to create");
        }
    };

    useEffect(() => {
        getFooterData();
    }, []);

    // ------------------------------------------------
    return (
        <div className="p-6 space-y-6 text-white bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Manage Footer Content</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                    {showForm ? "Close Form" : "Create Footer Content"}
                </button>
            </div>

            {/* 🔹 Create Footer Form */}
            {showForm && (
                <form
                    onSubmit={handleCreate}
                    className="bg-gray-800 p-6 rounded-xl space-y-5 border border-gray-700 shadow-lg"
                >
                    {/* Basic Info */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        rows={4}
                        required
                    />

                    {/* 🔹 Services */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">
                            Services (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.services.join(", ")}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    services: e.target.value.split(",").map((s) => s.trim()),
                                })
                            }
                            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* 🔹 Follow Me Links */}
                    <div className="space-y-3">
                        <p className="font-semibold text-gray-300 text-lg">Follow Me Links</p>
                        {formData.followMeLinks.map((link, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Icon (e.g. github)"
                                    value={link.icon}
                                    onChange={(e) => {
                                        const newLinks = [...formData.followMeLinks];
                                        newLinks[idx].icon = e.target.value;
                                        setFormData({ ...formData, followMeLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <input
                                    type="text"
                                    placeholder="URL"
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...formData.followMeLinks];
                                        newLinks[idx].url = e.target.value;
                                        setFormData({ ...formData, followMeLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newLinks = formData.followMeLinks.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, followMeLinks: newLinks });
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 rounded transition font-semibold"
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-semibold"
                        >
                            + Add Follow Me Link
                        </button>
                    </div>

                    {/* 🔹 Social Links */}
                    <div className="space-y-3">
                        <p className="font-semibold text-gray-300 text-lg">Social Links</p>
                        {formData.socialLinks.map((link, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Icon (e.g. facebook)"
                                    value={link.icon}
                                    onChange={(e) => {
                                        const newLinks = [...formData.socialLinks];
                                        newLinks[idx].icon = e.target.value;
                                        setFormData({ ...formData, socialLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <input
                                    type="text"
                                    placeholder="URL"
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...formData.socialLinks];
                                        newLinks[idx].url = e.target.value;
                                        setFormData({ ...formData, socialLinks: newLinks });
                                    }}
                                    className="flex-1 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newLinks = formData.socialLinks.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, socialLinks: newLinks });
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 rounded transition font-semibold"
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-semibold"
                        >
                            + Add Social Link
                        </button>
                    </div>

                    {/* 🔹 Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end border-t border-gray-700">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold shadow transition"
                        >
                            Create Footer
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold shadow transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* 🔹 Footer List */}
            {loading ? (
                <p className="text-gray-400 text-center mt-6">Loading footer content...</p>
            ) : footerList.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {footerList.map((footer) => (
                        <div
                            key={footer._id}
                            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:shadow-lg transition"
                        >
                            <h3 className="text-lg font-semibold mb-1">{footer.email}</h3>
                            <p className="text-sm text-gray-400 mb-2">{footer.phone}</p>
                            <p className="text-sm mb-2">{footer.location}</p>
                            <p className="text-gray-300 text-sm mb-4 whitespace-pre-wrap">
                                {footer.content}
                            </p>
                            <div className="flex justify-between gap-3">
                                <button
                                    onClick={() => router.push(`/manage-footer/${footer._id}`)}
                                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(footer._id)}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center mt-6">No footer content found.</p>
            )}
        </div>
    );
};

export default FooterContentPageComponent;

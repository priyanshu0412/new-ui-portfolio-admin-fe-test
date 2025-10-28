"use client";
import React, { useEffect, useState } from "react";
import { FetchApi } from "@/utilities";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";

// ---------------------------------------------------------------

const ProjectSpecificPageComponent = ({ projectId, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        techUsed: "",
        category: "",
        tags: "",
        githubLink: "",
        livePreviewLink: "",
        keyFeatures: "",
        isFeatured: false,
        client: "",
        completeDate: "",
        technicalChallengesAndSolutions: [{ question: "", answer: "" }],
        aboutProjectContent: "",
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchProject = async () => {
            setLoading(true);
            setError(null);
            const { success, data, message } = await FetchApi({
                url: `/project/${projectId}`,
            });

            if (success && data) {
                const project = data;
                setFormData({
                    title: project.title || "",
                    desc: project.desc || "",
                    techUsed: (project.techUsed || []).join(", "),
                    category: project.category || "",
                    tags: (project.tags || []).join(", "),
                    githubLink: project.githubLink || "",
                    livePreviewLink: project.livePreviewLink || "",
                    keyFeatures: (project.keyFeatures || []).join(", "),
                    isFeatured: project.isFeatured || false,
                    client: project.client || "",
                    completeDate: project.completeDate
                        ? new Date(project.completeDate).toISOString().slice(0, 10)
                        : "",
                    technicalChallengesAndSolutions:
                        project.technicalChallengesAndSolutions.length > 0
                            ? project.technicalChallengesAndSolutions
                            : [{ question: "", answer: "" }],
                    aboutProjectContent: project.aboutProjectContent || "",
                });
                setThumbnailPreview(project.thumbnailImg || "");
            } else {
                setError(message || "Failed to load project");
            }
            setLoading(false);
        };

        fetchProject();
    }, [projectId]);

    // Input change handlers
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            setThumbnail(null);
            setThumbnailPreview("");
        }
    };

    const handleTechChallengeChange = (index, field, value) => {
        const updated = [...formData.technicalChallengesAndSolutions];
        updated[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            technicalChallengesAndSolutions: updated,
        }));
    };

    const addTechChallenge = () => {
        setFormData((prev) => ({
            ...prev,
            technicalChallengesAndSolutions: [
                ...prev.technicalChallengesAndSolutions,
                { question: "", answer: "" },
            ],
        }));
    };

    const removeTechChallenge = (index) => {
        const updated = [...formData.technicalChallengesAndSolutions];
        updated.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            technicalChallengesAndSolutions: updated,
        }));
    };

    const handleEditorChange = (content) => {
        setFormData((prev) => ({
            ...prev,
            aboutProjectContent: content,
        }));
    };

    const handleSubmit = async (e) => {
        const token = localStorage.getItem("token");
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        const payload = {
            ...formData,
            techUsed: formData.techUsed
                ? formData.techUsed.split(",").map((s) => s.trim())
                : [],
            tags: formData.tags ? formData.tags.split(",").map((s) => s.trim()) : [],
            keyFeatures: formData.keyFeatures
                ? formData.keyFeatures.split(",").map((s) => s.trim())
                : [],
            technicalChallengesAndSolutions:
                formData.technicalChallengesAndSolutions.filter(
                    (ta) => ta.question.trim() || ta.answer.trim(),
                ),
            completeDate: formData.completeDate
                ? new Date(formData.completeDate)
                : null,
            isFeatured: formData.isFeatured,
            aboutProjectContent: formData.aboutProjectContent || "",
        };

        const formPayload = new FormData();
        for (const key in payload) {
            if (Array.isArray(payload[key])) {
                formPayload.append(key, JSON.stringify(payload[key]));
            } else if (payload[key] !== null && payload[key] !== undefined) {
                formPayload.append(key, payload[key]);
            }
        }
        if (thumbnail) {
            formPayload.append("thumbnailImg", thumbnail);
        }

        try {
            const { success, message } = await FetchApi({
                url: `/project/${projectId}`,
                method: "PATCH",
                data: formPayload,
                token,
            });

            if (success) {
                setSubmitSuccess("Project updated successfully.");
                onClose && onClose();
            } else {
                setSubmitError(message || "Failed to update project.");
            }
        } catch {
            setSubmitError("Error updating project.");
        }
        setSubmitLoading(false);
    };

    if (loading)
        return (
            <div className="text-center mt-10 text-gray-600">
                Loading project data...
            </div>
        );
    if (error)
        return <div className="text-center mt-10 text-red-600">Error: {error}</div>;

    return (
        <>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
                    Edit Project
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="">Select Category</option>
                            <option value="Fullstack">Fullstack</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                        </select>
                    </div>

                    {/* Tech Used */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tech Used (comma separated)
                        </label>
                        <input
                            type="text"
                            name="techUsed"
                            value={formData.techUsed}
                            onChange={handleChange}
                            placeholder="React, Node"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="learning, new"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Key Features */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Key Features (comma separated)
                        </label>
                        <input
                            type="text"
                            name="keyFeatures"
                            value={formData.keyFeatures}
                            onChange={handleChange}
                            placeholder="Feature1, Feature2"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Technical Challenges */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-3">
                            Technical Challenges & Solutions
                        </h3>
                        {formData.technicalChallengesAndSolutions.map((pair, i) => (
                            <div
                                key={i}
                                className="border border-gray-300 rounded-lg p-4 mb-4 relative bg-gray-50 space-y-3"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={pair.question}
                                        onChange={(e) =>
                                            handleTechChallengeChange(i, "question", e.target.value)
                                        }
                                        placeholder="Write the technical challenge question"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Answer
                                    </label>
                                    <textarea
                                        value={pair.answer}
                                        onChange={(e) =>
                                            handleTechChallengeChange(i, "answer", e.target.value)
                                        }
                                        placeholder="Provide the solution answer"
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                {formData.technicalChallengesAndSolutions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTechChallenge(i)}
                                        className="absolute top-3 right-3 text-red-600 hover:text-red-700 font-semibold text-lg"
                                        aria-label="Remove challenge"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addTechChallenge}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                        >
                            + Add Question & Answer
                        </button>
                    </div>

                    {/* About Project Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            About Project Content
                        </label>
                        <Editor
                            apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                            value={formData.aboutProjectContent}
                            init={{
                                height: 200,
                                menubar: false,
                                plugins: [
                                    "advlist autolink lists link image",
                                    "charmap preview anchor searchreplace visualblocks code fullscreen",
                                    "insertdatetime media table help wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic | " +
                                    "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </div>

                    {/* GitHub Link */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            GitHub Link
                        </label>
                        <input
                            type="url"
                            name="githubLink"
                            value={formData.githubLink}
                            onChange={handleChange}
                            placeholder="https://github.com/username/repo"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Live Preview Link */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Live Preview Link
                        </label>
                        <input
                            type="url"
                            name="livePreviewLink"
                            value={formData.livePreviewLink}
                            onChange={handleChange}
                            placeholder="https://yourlivepreview.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thumbnail Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="w-full text-gray-700"
                        />
                        {thumbnailPreview && (
                            <Image
                                width={300}
                                height={300}
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="mt-3 h-40 object-contain rounded-lg border border-gray-300"
                            />
                        )}
                    </div>

                    {/* Featured */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-5 h-5 accent-blue-600"
                        />
                        <span className="text-gray-700 font-medium">Is Featured</span>
                    </div>

                    {/* Client */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Client
                        </label>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Complete Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Complete Date
                        </label>
                        <input
                            type="date"
                            name="completeDate"
                            value={formData.completeDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Alerts */}
                    {submitError && (
                        <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-sm">
                            {submitError}
                        </p>
                    )}
                    {submitSuccess && (
                        <p className="text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                            {submitSuccess}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-lg shadow transition font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow transition font-semibold disabled:opacity-50"
                        >
                            {submitLoading ? "Updating..." : "Update Project"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProjectSpecificPageComponent;

// UI DONE 
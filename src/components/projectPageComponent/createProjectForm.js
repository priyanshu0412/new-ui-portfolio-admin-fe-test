"use client";
import React, { useState } from "react";
import { FetchApi } from "@/utilities";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";

// ----------------------------------------------------------------

const CreateProjectForm = ({ onClose, onProjectCreated }) => {
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generic change handler for simple inputs
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle thumbnail file and preview
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

    // Handle technicalChallengesAndSolutions field changes
    const handleTechChallengeChange = (index, field, value) => {
        const updated = [...formData.technicalChallengesAndSolutions];
        updated[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            technicalChallengesAndSolutions: updated,
        }));
    };

    // Add new question-answer pair
    const addTechChallenge = () => {
        setFormData((prev) => ({
            ...prev,
            technicalChallengesAndSolutions: [
                ...prev.technicalChallengesAndSolutions,
                { question: "", answer: "" },
            ],
        }));
    };

    // Remove question-answer pair at index
    const removeTechChallenge = (index) => {
        const updated = [...formData.technicalChallengesAndSolutions];
        updated.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            technicalChallengesAndSolutions: updated,
        }));
    };

    // TinyMCE editor change handler
    const handleEditorChange = (content) => {
        setFormData((prev) => ({
            ...prev,
            aboutProjectContent: content,
        }));
    };

    // Submit handler prepares payload and sends FormData
    const handleSubmit = async (e) => {
        const token = localStorage.getItem("token");
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Prepare payload converting comma-separated fields to arrays
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

        // Build FormData object
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
            const { success, data, message } = await FetchApi({
                url: "/project",
                method: "POST",
                data: formPayload,
                token,
            });

            if (success) {
                onProjectCreated(data.project);
                onClose();
            } else {
                setError(message || "Failed to create project");
            }
        } catch (err) {
            setError("Error while creating project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6">Edit Project</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Title</span>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Description */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Description</span>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Category */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Category</span>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option value="Fullstack">Fullstack</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                        </select>
                    </label>

                    {/* Tech Used */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Tech Used (comma separated)</span>
                        <input
                            type="text"
                            name="techUsed"
                            value={formData.techUsed}
                            onChange={handleChange}
                            placeholder="React, Node"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Tags */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Tags (comma separated)</span>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="learning, new"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Key Features */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Key Features (comma separated)</span>
                        <input
                            type="text"
                            name="keyFeatures"
                            value={formData.keyFeatures}
                            onChange={handleChange}
                            placeholder="Feature1, Feature2"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Technical Challenges and Solutions Dynamic List */}
                    <div>
                        <span className="font-semibold block mb-2">Technical Challenges and Solutions</span>
                        {formData.technicalChallengesAndSolutions.map((pair, i) => (
                            <div key={i} className="border border-gray-300 rounded p-3 mb-4 relative space-y-3 bg-gray-50">
                                <label>
                                    <span className="block font-semibold mb-1">Question</span>
                                    <input
                                        type="text"
                                        value={pair.question}
                                        onChange={(e) => handleTechChallengeChange(i, "question", e.target.value)}
                                        placeholder="Write the technical challenge question"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </label>
                                <label>
                                    <span className="block font-semibold mb-1">Answer</span>
                                    <textarea
                                        value={pair.answer}
                                        onChange={(e) => handleTechChallengeChange(i, "answer", e.target.value)}
                                        rows={3}
                                        placeholder="Provide the solution answer"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </label>
                                {formData.technicalChallengesAndSolutions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTechChallenge(i)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-semibold text-lg"
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
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            + Add Question & Answer
                        </button>
                    </div>

                    {/* About Project Content */}
                    <label className="block">
                        <span className="font-semibold text-gray-700 block mb-2">About Project Content</span>
                        <Editor
                            apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                            value={formData.aboutProjectContent}
                            init={{
                                height: 200,
                                menubar: false,
                                plugins: [
                                    "advlist autolink lists link image charmap print preview anchor",
                                    "searchreplace visualblocks code fullscreen",
                                    "insertdatetime media table paste code help wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic backcolor | " +
                                    "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </label>

                    {/* GitHub Link */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">GitHub Link</span>
                        <input
                            type="url"
                            name="githubLink"
                            value={formData.githubLink}
                            onChange={handleChange}
                            placeholder="https://github.com/username/repo"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Live Preview Link */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Live Preview Link</span>
                        <input
                            type="url"
                            name="livePreviewLink"
                            value={formData.livePreviewLink}
                            onChange={handleChange}
                            placeholder="https://yourlivepreview.com"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Thumbnail Image Upload */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Thumbnail Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="w-full"
                        />
                        {thumbnailPreview && (
                            <Image
                                height={300}
                                width={300}
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="mt-2 h-40 object-contain rounded border"
                            />
                        )}
                    </label>

                    {/* Is Featured */}
                    <label className="inline-flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                        <span className="ml-2 text-gray-700">Is Featured</span>
                    </label>

                    {/* Client */}
                    <label className="block">
                        <span className="font-semibold text-gray-700">Client</span>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Complete Date */}
                    <label className="block mb-6">
                        <span className="font-semibold text-gray-700">Complete Date</span>
                        <input
                            type="date"
                            name="completeDate"
                            value={formData.completeDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    {/* Submit Error */}
                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateProjectForm;

// UI DONE 

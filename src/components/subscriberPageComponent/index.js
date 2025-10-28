"use client"
import React, { useEffect, useState } from "react";
import { FetchApi } from "@/utilities";
import { Editor } from "@tinymce/tinymce-react";
import { motion } from "framer-motion";

// --------------------------------------------------------

const SubscriberPageComponent = () => {

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [subscribers, setSubscribers] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [sendToAll, setSendToAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRecipientModal, setShowRecipientModal] = useState(false);
    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchSubscribers = async () => {
            const res = await FetchApi(
                {
                    url: "/subscribe/list",
                    method: "GET",
                    token
                }
            );
            if (res.success) {
                setSubscribers(res.data || []);
            }
        };
        fetchSubscribers();
         // eslint-disable-next-line
    }, []);


    const toggleRecipient = (email) => {
        if (selectedRecipients.includes(email)) {
            setSelectedRecipients(selectedRecipients.filter((e) => e !== email));
        } else {
            setSelectedRecipients([...selectedRecipients, email]);
        }
    };


    const handleSendNewsletter = async () => {
        if (!subject.trim() || !content.trim()) {
            alert("Please fill subject and content");
            return;
        }

        setLoading(true);

        const res = await FetchApi({
            url: "/subscribe/send-newsletter",
            method: "POST",
            data: {
                subject,
                content,
                recipients: sendToAll ? [] : selectedRecipients,
                sendToAll,
            },
            token
        });

        setLoading(false);
        if (res.success) {
            alert(res.data.message);
            setSubject("");
            setContent("");
            setSelectedRecipients([]);
            setSendToAll(false);
            setShowRecipientModal(false);
        } else {
            alert("Failed to send newsletter!");
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-800">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-100"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        📰 Send Newsletter
                    </h1>

                    <input
                        type="text"
                        placeholder="Newsletter Subject"
                        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <Editor
                        apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                        value={content}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: ["link", "lists", "autolink", "code", "preview"],
                            toolbar:
                                "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | code preview",
                        }}
                        onEditorChange={(newValue) => setContent(newValue)}
                    />

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => setShowRecipientModal(true)}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Next → Select Recipients
                        </button>
                    </div>
                </motion.div>

                {/* ---------------------------------------------------- */}
                {/* Modal for selecting recipients */}
                {showRecipientModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                Select Recipients
                            </h2>

                            <div className="flex items-center mb-4">
                                <input
                                    id="sendToAll"
                                    type="checkbox"
                                    checked={sendToAll}
                                    onChange={(e) => {
                                        setSendToAll(e.target.checked);
                                        if (e.target.checked) setSelectedRecipients([]);
                                    }}
                                    className="mr-2"
                                />
                                <label htmlFor="sendToAll" className="text-gray-700">
                                    Send to All Subscribers
                                </label>
                            </div>

                            {!sendToAll && (
                                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {subscribers.length > 0 ? (
                                        subscribers.map((s) => (
                                            <label
                                                key={s._id}
                                                className="flex items-center justify-between mb-2"
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRecipients.includes(s.email)}
                                                        onChange={() => toggleRecipient(s.email)}
                                                        className="mr-2"
                                                    />
                                                    <span>{s.email}</span>
                                                </div>
                                                {s.subscribed ? (
                                                    <span className="text-green-600 text-sm">Subscribed</span>
                                                ) : (
                                                    <span className="text-red-500 text-sm">Unsubscribed</span>
                                                )}
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No subscribers found.</p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowRecipientModal(false)}
                                    variant="outline"
                                    className="border-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handleSendNewsletter}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {loading ? "Sending..." : "Send Newsletter"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </>
    )
}

export default SubscriberPageComponent

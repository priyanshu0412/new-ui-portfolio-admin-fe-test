"use client"
import React from "react"
import { motion } from "framer-motion"

// -----------------------------------------------

const NotFoundPage = () => {
    return (
        <>
            <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden px-4">
                {/* Background floating shapes */}
                <motion.div
                    className="absolute w-72 h-72 bg-gradient-to-tr from-indigo-400 to-blue-300 rounded-full opacity-30 top-[-5rem] left-[-5rem] blur-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-20 bottom-[-10rem] right-[-10rem] blur-3xl"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                />

                {/* Main content */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 text-center max-w-md"
                >
                    {/* 404 with playful hover */}
                    <motion.h1
                        className="text-[10rem] sm:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-xl"
                        whileHover={{ rotate: [-10, 10, -5, 5, 0], scale: 1.1 }}
                        transition={{ duration: 1 }}
                    >
                        404
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl font-semibold mt-6 text-gray-700"
                    >
                        Lost in the Matrix?
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-4 text-gray-500"
                    >
                        This page has disappeared into cyberspace… or maybe it never existed.
                    </motion.p>

                    <motion.a
                        whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0] }}
                        whileTap={{ scale: 0.95 }}
                        href="/"
                        className="inline-block mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-xl hover:brightness-110 transition"
                    >
                        Teleport Home
                    </motion.a>
                </motion.div>
            </div>
        </>
    )
}

export default NotFoundPage

"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { FetchApi } from "@/utilities";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/auth/authSlice";

// -----------------------------------------

const LoginComponent = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const dispatch = useDispatch();

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Validate inputs
        if (!email.trim() || !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        // API Call
        const res = await FetchApi({
            url: "/user/login",
            method: "POST",
            data: { email, password },
        });

        setLoading(false);
        if (!res.success) {
            setError(res.data?.message || "Invalid credentials");
        } else {
            dispatch(loginSuccess(res.data.token));
            setSuccess("Login successful!");
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left Side (same as your code) */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-bl from-[#4F3DFE] to-[#9F7AEA] relative overflow-hidden p-6">
                {/* Decorative Circles */}
                <div className="absolute left-1/4 top-24 w-56 h-56 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute left-8 bottom-20 w-36 h-36 bg-white/20 rounded-full blur-lg animate-bounce"></div>
                <div className="absolute right-8 top-32 w-24 h-24 bg-white/10 rounded-full blur-md animate-ping"></div>

                {/* Branding */}
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon
                            icon="mdi:view-dashboard"
                            className="text-5xl text-[#FFE066]"
                        />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow">
                        Welcome to <span className="text-[#FFE066]">Priyanshu Admin</span>
                    </h2>
                    <p className="text-lg text-[#f0e3ff] mt-4 max-w-sm leading-relaxed">
                        Securely manage your dashboard content <br /> with an elegant and
                        responsive UI.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-50 px-4 py-16">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-gray-100"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center mb-2">
                        <Icon
                            icon="mdi:lock-outline"
                            className="text-4xl text-[#4F3DFE] mb-2"
                        />
                        <h3 className="text-2xl font-semibold text-gray-800">
                            Welcome Back
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Please login to continue
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-600 mb-1 text-sm font-medium">
                            Email Address
                        </label>
                        <div className="relative">
                            <Icon
                                icon="mdi:email-outline"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                            />
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F3DFE] transition"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-600 mb-1 text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <Icon
                                icon="mdi:lock-outline"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F3DFE] transition"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4F3DFE] transition"
                                tabIndex={-1}
                            >
                                <Icon
                                    icon={
                                        showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                                    }
                                    className="text-lg"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Error/Success Message */}
                    {error && (
                        <div className="text-red-600 text-center text-sm">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-600 text-center text-sm">{success}</div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg bg-[#4F3DFE] hover:bg-[#3728c8] text-white font-semibold text-lg shadow-md transition-all duration-300 ${loading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;

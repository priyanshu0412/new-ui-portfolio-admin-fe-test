"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "../icon";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { menuItems } from "@/mock/data";

// -------------------------------------------------

const Navbar = () => {
    const dispatch = useDispatch();
    const userAuth = useSelector((state) => state.auth.isAuthenticated);

    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleDropdown = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    return (
        <>
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <Icon
                                icon="mdi:shield-account-outline"
                                className="w-7 h-7 flex justify-center items-center text-indigo-600 transition-transform duration-300 group-hover:scale-110"
                            />
                            <span className="text-lg font-semibold text-gray-800 tracking-wide whitespace-nowrap">
                                Priyanshu Admin
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            {menuItems.map((item) =>
                                item.children ? (
                                    <div key={item.label} className="relative group">
                                        <button
                                            onClick={() => toggleDropdown(item.label)}
                                            className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            <Icon
                                                icon={item.icon}
                                                className="w-5 h-5 flex justify-center items-center text-gray-600 group-hover:text-indigo-600"
                                            />
                                            {item.label}
                                            <Icon
                                                icon="mdi:chevron-down"
                                                className="w-4 h-4 mt-[1px] text-gray-500"
                                            />
                                        </button>

                                        {openDropdown === item.label && (
                                            <div className="absolute left-0 mt-2 w-52 rounded-lg shadow-lg bg-white border border-gray-100 z-50">
                                                <div className="py-2 flex flex-col">
                                                    {item.children.map((sub) => (
                                                        <Link
                                                            key={sub.label}
                                                            href={sub.href}
                                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 rounded-md text-sm"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                        <Icon
                                            icon={item.icon}
                                            className="w-5 h-5 flex justify-center items-center text-gray-600 group-hover:text-indigo-600"
                                        />
                                        {item.label}
                                    </Link>
                                )
                            )}

                            {/* Auth Button */}
                            {mounted &&
                                (userAuth ? (
                                    <button
                                        onClick={() => dispatch(logout())}
                                        className="ml-4 py-2 px-4 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="ml-4 py-2 px-4 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                                    >
                                        Login
                                    </Link>
                                ))}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-200 flex items-center justify-center"
                        >
                            <Icon
                                icon={mobileOpen ? 'mdi:close' : 'mdi:menu'}
                                className="w-6 h-6 flex justify-center items-center"
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
                        <div className="px-4 py-3 space-y-2 flex flex-col">
                            {menuItems.map((item) =>
                                item.children ? (
                                    <div key={item.label}>
                                        <button
                                            onClick={() => toggleDropdown(item.label)}
                                            className="flex items-center justify-between w-full text-gray-700 py-2 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    icon={item.icon}
                                                    className="w-5 h-5 flex justify-center items-center"
                                                />
                                                {item.label}
                                            </div>
                                            <Icon
                                                icon={
                                                    openDropdown === item.label
                                                        ? 'mdi:chevron-up'
                                                        : 'mdi:chevron-down'
                                                }
                                                className="w-4 h-4 flex justify-center items-center"
                                            />
                                        </button>
                                        {openDropdown === item.label && (
                                            <div className="pl-6 flex flex-col space-y-1 mt-1">
                                                {item.children.map((sub) => (
                                                    <Link
                                                        key={sub.label}
                                                        href={sub.href}
                                                        className="block text-gray-600 py-1 pl-1 hover:text-indigo-600 transition-colors duration-200 rounded-md text-sm"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-2 text-gray-700 py-2 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                        <Icon
                                            icon={item.icon}
                                            className="w-5 h-5 flex justify-center items-center"
                                        />
                                        {item.label}
                                    </Link>
                                )
                            )}

                            {/* Auth Button */}
                            {mounted &&
                                (userAuth ? (
                                    <button
                                        onClick={() => dispatch(logout())}
                                        className="mt-3 w-full py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="mt-3 w-full block text-center py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                                    >
                                        Login
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;

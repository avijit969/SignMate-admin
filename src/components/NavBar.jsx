import React, { useState } from 'react';
import imagePath from '../assets/images/dp.jpg';
import { CiLogout } from 'react-icons/ci';
import Sidebar from './Sidebar';
import { logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const Navbar = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="bg-slate-700 drop-shadow-md border-b-2 border-gray-300">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {/* Sidebar Toggle Button */}
                        <button onClick={toggleSidebar} className="text-black focus:outline-none p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                                />
                            </svg>
                        </button>
                        {/* Brand Name */}
                        <h1 className="text-black text-3xl font-bold">SignMate</h1>
                    </div>

                    {/* Profile Icon */}
                    <div className="relative pt-2 pr-0">
                        <button onClick={toggleDrawer} className="focus:outline-none">
                            <img
                                src={imagePath}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            />
                        </button>

                        {/* Profile Drawer */}
                        {isDrawerOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                                <div className="p-4 flex flex-col items-center">
                                    <img
                                        src={imagePath}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover mb-4"
                                    />
                                    <h2 className="text-lg font-semibold">Admin</h2>
                                    <p className="text-sm text-gray-500">admin@gmail.com</p>
                                </div>
                                <div className="border-t p-4">
                                    <button className="w-full text-left py-2 px-4 hover:bg-gray-100">Edit Profile</button>
                                    <button className="w-full text-left py-2 px-4 hover:bg-gray-100 align-middle font-bold text-red-400" onClick={() => dispatch(logout())} >
                                        Logout
                                        <CiLogout className="inline-block ml-4 text-red-400 align-middle font-extrabold" size={20}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
};

export default Navbar;

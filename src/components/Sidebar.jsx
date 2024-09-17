import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaClipboard } from 'react-icons/fa';
import { CiHome, CiVideoOn } from 'react-icons/ci';
import { GoTasklist } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation(); // Get the current path

    return (
        <div onClick={toggleSidebar}>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-68 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out`}
            >
                <div className="flex items-center justify-evenly h-[70px] shadow-xl bg-gray-100">
                    <h1 className="text-2xl text-black font-bold">SignMate</h1>
                    <IoMdClose className="cursor-pointer" size={30} onClick={toggleSidebar} />
                </div>
                <nav className="mt-10">
                    <ul>
                        <li className={`px-4 py-2 hover:bg-gray-200 rounded-lg m-2 ${location.pathname === '/' ? 'bg-gray-200' : ''}`}>
                            <Link
                                to="/"
                                className={`flex items-center text-xl font-semibold ${location.pathname === '/' ? 'text-green-600' : 'text-black'
                                    } hover:text-green-600`}
                                onClick={toggleSidebar}
                            >
                                <CiHome className="mr-3" /> Home
                            </Link>
                        </li>
                        <li className={`px-4 py-2 hover:bg-gray-200 rounded-lg m-2 ${location.pathname === '/upload-video' ? 'bg-gray-200' : ''}`}>
                            <Link
                                to="/upload-video"
                                className={`flex items-center text-xl ${location.pathname === '/upload-video' ? 'text-green-600' : 'text-black'
                                    } hover:text-green-600`}
                                onClick={toggleSidebar}
                            >
                                <CiVideoOn className="mr-3" /> Upload Sign Videos
                            </Link>
                        </li>
                        <li className={`px-4 py-2 hover:bg-gray-200 rounded-lg m-2 ${location.pathname === '/upload-practice-question' ? 'bg-gray-200' : ''}`}>
                            <Link
                                to="/upload-practice-question"
                                className={`flex items-center text-xl ${location.pathname === '/upload-practice-question' ? 'text-green-600' : 'text-black'
                                    } hover:text-green-600`}
                                onClick={toggleSidebar}
                            >
                                <GoTasklist className="mr-3" /> Upload Practice Questions
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;

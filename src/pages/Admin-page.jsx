import React from 'react';
import { Link } from 'react-router-dom';

function Admin() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
                <div className="space-y-4">
                    <Link
                        to="/upload-video"
                        className="block bg-blue-500 text-white font-bold py-3 px-6 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Upload Sign videos
                    </Link>
                    <Link
                        to="/upload-practice-question"
                        className="block bg-green-500 text-white font-bold py-3 px-6 rounded hover:bg-green-600 transition duration-300"
                    >
                        Upload Practice Question
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Admin;

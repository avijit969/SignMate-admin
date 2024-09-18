import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Import icons
import { ImSpinner2 } from 'react-icons/im'; // Loading spinner icon

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    const limit = 5; // Users per page

    useEffect(() => {
        fetchUsers();
    }, [page, filter, sortBy, sortOrder]);

    const fetchUsers = async () => {
        setLoading(true);
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        let query = supabase
            .from('users') // Adjust with your actual table name
            .select('*', { count: 'exact' })
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(start, end);

        // Apply filter if present
        if (filter) {
            query = query.ilike('name', `%${filter}%`);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data);
            setTotalUsers(count);
            setTotalPages(Math.ceil(count / limit));
        }
        setLoading(false);
    };

    const handleSort = (column) => {
        setSortBy(column);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
        setPage(1); // Reset to the first page when sorting changes
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="p-6 w-[100%]">
            <h1 className="text-2xl font-bold mb-4">Total {totalUsers} Users are available in signMate</h1>

            {/* Filter Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1); // Reset to first page when filter changes
                    }}
                    className="border px-3 py-2 rounded-md w-full"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <ImSpinner2 className="animate-spin text-4xl text-blue-500" />
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <div className="grid grid-cols-6 font-bold mb-2">
                            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('name')}>
                                Name
                                {sortBy === 'name' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                            </span>
                            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('email')}>
                                Email
                                {sortBy === 'email' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                            </span>
                            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('points')}>
                                Points
                                {sortBy === 'points' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                            </span>
                            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('streak')}>
                                Streak
                                {sortBy === 'streak' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                            </span>
                            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('sings')}>
                                Sings
                                {sortBy === 'sings' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                            </span>
                            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('practice_score')}>
                                Practice Score
                                {sortBy === 'practice_score' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                            </span>
                        </div>
                        {users.map((user) => (
                            <div key={user.id} className="border-b p-4 grid grid-cols-6 gap-4">
                                <span>{user.name}</span>
                                <span>{user.email}</span>
                                <span>{user.points}</span>
                                <span>{user.streak}</span>
                                <span>{user.sings}</span>
                                <span>{user.practice_score}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-md ${page === 1
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            <FaArrowLeft /> Previous
                        </button>

                        <p className="text-gray-600">
                            Page {page} of {totalPages}
                        </p>

                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-md ${page === totalPages
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            Next <FaArrowRight />
                        </button>
                    </div>

                    <p className="text-gray-600 mt-4">
                        Showing {users.length} of {totalUsers} users.
                    </p>
                </>
            )}
        </div>
    );
};

export default Admin;

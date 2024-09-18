import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import Modal from '../components/Model';
import Loader from '../components/Loader';
import { Button } from '@material-tailwind/react';

/**
 * Manage sign videos page
 *
 * This page allows you to add, edit and delete sign videos.
 *
 * It fetches sign videos from the Supabase database and displays them in a table.
 *
 * You can add a new sign video by clicking the "Add Sign Video" button.
 *
 * You can edit an existing sign video by clicking the "Edit" button.
 *
 * You can delete a sign video by clicking the "Delete" button.
 *
 * It also allows you to filter the sign videos by category.
 *
 * The page will automatically fetch the sign videos when the category is changed.
 *
 * The page will also automatically fetch the sign videos when the page is loaded or when the user navigates to a different page.
 */

function ManageSignVideo() {
    const [videos, setVideos] = useState([]);
    const [category, setCategory] = useState('alphabets');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [signVideos, setSignVideos] = useState({
        video: '',
        label: '',
        labelImage: '',
        category: ''
    });
    const [updateVideoId, setUpdateVideoId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch videos from Supabase
    const fetchVideos = async () => {
        setLoading(true);
        try {
            const { data, error, count } = await supabase
                .from('learning')
                .select('*', { count: 'exact' })
                .eq('category', category)
                .range((currentPage - 1) * 5, currentPage * 5 - 1);
            if (error) throw error;
            setVideos(data);
            setTotalPages(Math.ceil(count / 5));
        } catch (error) {
            toast.error('Failed to fetch videos.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVideos();
    }, [currentPage, category]);

    // Upload file to Supabase storage
    const uploadFile = async (file, bucketFolder) => {
        try {
            console.log(file, bucketFolder)
            if (!file) return null;

            const fileName = generateUniqueFileName(file);
            const { error: uploadError } = await supabase.storage
                .from(bucketFolder)
                .upload(`public/${fileName}`, file);

            if (uploadError) {
                console.error(`Upload Error (${bucketFolder}):`, uploadError.message);
                toast.error(`Failed to upload ${bucketFolder === "sign_videos" ? "video" : "image"}.`);
                return null;
            }

            const { publicUrl, error: urlError } = supabase.storage
                .from(bucketFolder)
                .getPublicUrl(`public/${fileName}`).data;

            if (urlError) {
                console.error(`URL Fetch Error (${bucketFolder}):`, urlError.message);
                toast.error(`Failed to fetch URL for ${bucketFolder === "sign_videos" ? "video" : "image"}.`);
                return null;
            }

            return publicUrl;
        } catch (error) {
            console.error('Unexpected Error:', error.message);
            toast.error('An unexpected error occurred during file upload.');
            return null;
        }
    };
    const generateUniqueFileName = (file) => {
        const timestamp = Date.now();
        return `${timestamp}-${file.name}`;
    };
    // Handle add video
    const handleAdd = async () => {
        try {
            const newVideo = {
                video_url: await uploadFile(signVideos.video, 'sign_videos'),
                label: signVideos.label.toUpperCase(),
                label_image: await uploadFile(signVideos.labelImage, 'sign_images'),
                category: category
            };
            const { error } = await supabase
                .from('learning')
                .insert([newVideo]);
            if (error) throw error;
            toast.success('Video added successfully.');
            fetchVideos();
            closeModal();
        } catch (error) {
            toast.error('Failed to add video.');
        }
    };

    // Handle update video
    const handleUpdate = async () => {
        try {
            const updatedVideo = {
                video_url: signVideos.video instanceof File ? await uploadFile(signVideos.video, 'sign_videos') : signVideos.video,
                label: signVideos.label.toUpperCase(),
                label_image: signVideos.labelImage instanceof File ? await uploadFile(signVideos.labelImage, 'sign_images') : signVideos.labelImage,
                category: signVideos.category
            };
            const { error } = await supabase
                .from('learning')
                .update(updatedVideo)
                .eq('id', updateVideoId);
            if (error) throw error;
            toast.success('Video updated successfully.');
            fetchVideos();
            closeModal();
        } catch (error) {
            toast.error('Failed to update video.');
        }
    };

    // Handle delete video
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('learning')
                .delete()
                .eq('id', id);
            if (error) throw error;
            toast.success('Video deleted successfully.');
            fetchVideos();
        } catch (error) {
            toast.error('Failed to delete video.');
        }
    };

    // Open modal for adding or editing
    const openModal = (video = null) => {
        if (video) {
            setSignVideos({
                video: video.video_url,
                label: video.label,
                labelImage: video.label_image,
                category: video.category
            });
            setUpdateVideoId(video.id);
            setIsEditing(true);
        } else {
            clearForm();
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        clearForm();
        setIsModalOpen(false);
        setIsEditing(false);
    };

    const clearForm = () => {
        setSignVideos({
            video: '',
            label: '',
            labelImage: '',
            category: ''
        });
        setUpdateVideoId(null);
    };

    // Handle input changes
    const handleInputChange = (event) => {
        setSignVideos({ ...signVideos, [event.target.name]: event.target.value });
    };

    const handleFileChange = (event) => {
        setSignVideos({ ...signVideos, [event.target.name]: event.target.files[0] });
    };

    // Handle category change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1); // Reset to the first page when category changes
    };

    return (
        <div className="p-6 min-w-full mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Sign Videos</h1>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Select Category</label>
                <select
                    className="w-full px-2 py-2 border rounded"
                    value={category}
                    onChange={handleCategoryChange}
                >
                    <option value="">Select category</option>
                    <option value="greetings">Greetings</option>
                    <option value="alphabets">Alphabets</option>
                    <option value="numbers">Numbers</option>
                    <option value="colors">Colors</option>
                    <option value="animals">Animals</option>
                    <option value="emotions">Emotions</option>
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="body parts">Body Parts</option>
                    <option value="shapes">Shapes</option>
                </select>
            </div>

            <div className="flex justify-start mb-2">
                <Button color="green" onClick={() => openModal()}>Add Sign Video</Button>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="mb-4 rounded-2xl">
                    <table className="min-w-full bg-white border border-gray-200 rounded-2xl">
                        <thead className="rounded-2xl border-b">
                            <tr>
                                <th className="px-2 py-2 text-left">Video</th>
                                <th className="px-2 py-2 text-left">Label</th>
                                <th className="px-2 py-2 text-left">Label Image</th>
                                <th className="px-2 py-2 text-left">Category</th>
                                <th className="px-2 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr key={video.id} className='border-b'>
                                    <td className="px-2 py-2">
                                        <video width="250" controls className="mt-2 rounded-xl object-cover ">
                                            <source src={video.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </td>
                                    <td className="px-2 py-2">{video.label}</td>
                                    <td className="px-2 py-2">
                                        <img src={video.label_image} alt={video.label} width="100" />
                                    </td>
                                    <td className="px-2 py-2">{video.category}</td>
                                    <td className="px-2 py-2 space-x-2">
                                        <Button color="blue" onClick={() => openModal(video)}>Edit</Button>
                                        <Button color="red" onClick={() => handleDelete(video.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-center items-center space-x-2">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Edit' : 'Add'} Sign Video</h1>
                <div>
                    <div className="mb-4">
                        <label htmlFor="video" className="block text-sm font-bold mb-2">Video:</label>
                        <input
                            className="w-full px-2 py-2 border rounded"
                            type="file"
                            id="video"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="label" className="block text-sm font-bold mb-2">Label:</label>
                        <input
                            className="w-full px-2 py-2 border rounded"
                            type="text"
                            id="label"
                            name="label"
                            value={signVideos.label.toUpperCase()}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="labelImage" className="block text-sm font-bold mb-2">Label Image:</label>
                        <input
                            className="w-full px-2 py-2 border rounded"
                            type="file"
                            id="labelImage"
                            name="labelImage"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-bold mb-2">Category:</label>
                        {!isEditing ? (
                            <select
                                className="w-full px-2 py-2 border rounded"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select category</option>
                                <option value="greetings">Greetings</option>
                                <option value="alphabets">Alphabets</option>
                                <option value="numbers">Numbers</option>
                                <option value="colors">Colors</option>
                                <option value="animals">Animals</option>
                                <option value="emotions">Emotions</option>
                                <option value="food">Food</option>
                                <option value="transportation">Transportation</option>
                                <option value="body parts">Body Parts</option>
                                <option value="shapes">Shapes</option>
                            </select>
                        ) : (
                            <p className="w-full px-2 py-2 border rounded">{signVideos.category}</p>
                        )}
                    </div>
                    <Button onClick={isEditing ? handleUpdate : handleAdd}>
                        {isEditing ? 'Update' : 'Add'} Video
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default ManageSignVideo;

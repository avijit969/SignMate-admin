import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';
import AddLearning from './Add-learning';

function SignVideoManager() {
    const [category, setCategory] = useState('alphabets');
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [editingVideo, setEditingVideo] = useState(null);
    const [updatedLabel, setUpdatedLabel] = useState('');
    const [updatedLabelImage, setUpdatedLabelImage] = useState(null);
    const [updatedVideoFile, setUpdatedVideoFile] = useState(null);

    const [labelImagePreview, setLabelImagePreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');
    const [addMoreSignVideos, setAddMoreSignVideos] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchVideos();
    }, [category, currentPage]);

    useEffect(() => {
        if (updatedLabelImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLabelImagePreview(reader.result);
            };
            reader.readAsDataURL(updatedLabelImage);
        } else {
            setLabelImagePreview('');
        }
    }, [updatedLabelImage]);

    useEffect(() => {
        if (updatedVideoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(updatedVideoFile);
        } else {
            setVideoPreview('');
        }
    }, [updatedVideoFile]);

    useEffect(() => {
        // Reset AddLearning visibility when category changes
        setAddMoreSignVideos(false);
    }, [category]);

    const fetchVideos = async () => {
        try {
            const { data, error, count } = await supabase
                .from('learning')
                .select('*', { count: 'exact' })
                .eq('category', category)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

            if (error) throw error;

            setVideos(data);
            setTotalPages(Math.ceil(count / itemsPerPage));
        } catch (error) {
            toast.error('Failed to fetch videos.');
        }
    };

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

    const handleUpdate = async (id) => {
        let updatedData = { label: updatedLabel };

        try {
            if (updatedLabelImage) {
                const labelImageFileName = generateUniqueFileName(updatedLabelImage);
                const { data: imageData, error: imageError } = await supabase.storage
                    .from('sign_images')
                    .upload(`public/${labelImageFileName}`, updatedLabelImage);

                if (imageError) throw imageError;

                const label_image_url = supabase.storage
                    .from('sign_images')
                    .getPublicUrl(`public/${labelImageFileName}`).data.publicUrl;

                updatedData.label_image = label_image_url;
            }

            if (updatedVideoFile) {
                const videoFileName = generateUniqueFileName(updatedVideoFile);
                const { data: videoData, error: videoError } = await supabase.storage
                    .from('sign_videos')
                    .upload(`public/${videoFileName}`, updatedVideoFile);

                if (videoError) throw videoError;

                const video_url = supabase.storage
                    .from('sign_videos')
                    .getPublicUrl(`public/${videoFileName}`).data.publicUrl;

                updatedData.video_url = video_url;
            }

            const { error } = await supabase
                .from('learning')
                .update(updatedData)
                .eq('id', id);

            if (error) throw error;

            toast.success('Video updated successfully.');
            clearUpdateForm();
            fetchVideos();
        } catch (error) {
            toast.error('Failed to update video.');
        }
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1); // Reset to the first page when category changes
    };

    const generateUniqueFileName = (file) => {
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileNameWithoutExtension = file.name.replace(`.${fileExtension}`, '');
        return `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;
    };

    const clearUpdateForm = () => {
        setEditingVideo(null);
        setUpdatedLabel('');
        setUpdatedLabelImage(null);
        setUpdatedVideoFile(null);
        setLabelImagePreview('');
        setVideoPreview('');
    };


    return (
        <div className="bg-gray-100 h-full">
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Manage Sign Videos</h2>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <select
                        className="w-full p-2 border rounded"
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

                <div className="flex justify-end m-2">
                    <Button
                        variant="outline"
                        color="green"
                        size="lg"
                        onClick={() => setAddMoreSignVideos(true)}
                    >
                        Add More Sign Videos
                    </Button>
                </div>
                {addMoreSignVideos && <AddLearning initialCategory={category} />}

                <div className="overflow-x-auto rounded-xl">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="border-b bg-gray-200">
                                <th className="px-4 py-2 text-left">Video</th>
                                <th className="px-4 py-2 text-left">Category</th>
                                <th className="px-4 py-2 text-left">Label</th>
                                <th className="px-4 py-2 text-left">Label Image</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr key={video.id} className="border-b">
                                    <td className="px-4 py-2">
                                        <video controls width="250" className="mt-2 rounded-xl object-cover">
                                            <source src={video.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </td>
                                    <td className="px-4 py-2">{video.category}</td>
                                    <td className="px-4 py-2">
                                        {editingVideo === video.id ? (
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={updatedLabel}
                                                onChange={(e) => setUpdatedLabel(e.target.value)}
                                            />
                                        ) : (
                                            video.label
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {video.label_image && (
                                            <img
                                                src={video.label_image}
                                                alt="Label"
                                                className="w-24 h-24 object-cover"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingVideo === video.id ? (
                                            <div className="flex flex-col space-y-2">
                                                <label className="block text-sm font-bold mb-2">
                                                    Update Label Image
                                                </label>
                                                <input
                                                    type="file"
                                                    className="p-2 border rounded"
                                                    accept="image/*"
                                                    onChange={(e) => setUpdatedLabelImage(e.target.files[0])}
                                                />
                                                {labelImagePreview && (
                                                    <img
                                                        src={labelImagePreview}
                                                        alt="Label Preview"
                                                        className="w-24 h-24 object-cover"
                                                    />
                                                )}

                                                <label className="block text-sm font-bold mb-2">
                                                    Update Video
                                                </label>
                                                <input
                                                    type="file"
                                                    className="p-2 border rounded"
                                                    accept="video/*"
                                                    onChange={(e) => setUpdatedVideoFile(e.target.files[0])}
                                                />
                                                {videoPreview && (
                                                    <video className="w-32" controls>
                                                        <source src={videoPreview} type="video/mp4" />
                                                    </video>
                                                )}
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                                    onClick={() => handleUpdate(video.id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
                                                    onClick={clearUpdateForm}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    onClick={() => {
                                                        setEditingVideo(video.id);
                                                        setUpdatedLabel(video.label);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                                                    onClick={() => handleDelete(video.id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignVideoManager;

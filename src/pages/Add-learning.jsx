import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';

function Add_learning() {
    const [video, setVideo] = useState(null);
    const [category, setCategory] = useState('');
    const [label, setLabel] = useState('');
    const [labelImage, setLabelImage] = useState(null);

    const generateUniqueFileName = (file) => {
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileNameWithoutExtension = file.name.replace(`.${fileExtension}`, '');
        return `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!video) {
            toast.error("Please select a video to upload.");
            return;
        }

        // Generate unique file name for video
        const videoFileName = generateUniqueFileName(video);

        // Upload video to Supabase storage bucket
        const { data: videoData, error: videoError } = await supabase.storage
            .from('sign_videos')
            .upload(`public/${videoFileName}`, video);

        if (videoError) {
            toast.error("Failed to upload video.");
            return;
        }

        const videoUrl = supabase.storage
            .from('sign_videos')
            .getPublicUrl(`public/${videoFileName}`).data.publicUrl;

        let label_image = '';
        if (labelImage) {
            // Generate unique file name for label image
            const labelImageFileName = generateUniqueFileName(labelImage);

            const { data: imageData, error: imageError } = await supabase.storage
                .from('sign_images')
                .upload(`public/${labelImageFileName}`, labelImage);

            if (imageError) {
                toast.error("Failed to upload label image.");
                return;
            }

            label_image = supabase.storage
                .from('sign_images')
                .getPublicUrl(`public/${labelImageFileName}`).data.publicUrl;
        }

        // Insert the video details into the learning table
        const { error } = await supabase
            .from('learning')
            .insert([
                { video_url: videoUrl, category, label, label_image },
            ]);

        if (error) {
            toast.error("Failed to upload video details.");
        } else {
            toast.success("Video details uploaded successfully.");
            setVideo(null);
            setCategory('');
            setLabel('');
            setLabelImage(null);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Sign videos</h2>
            <form onSubmit={handleUpload}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Video</label>
                    <input
                        type="file"
                        className="w-full p-2 border rounded"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <select
                        className="w-full p-2 border rounded"
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
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Sign name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Sign Image</label>
                    <input
                        type="file"
                        className="w-full p-2 border rounded"
                        accept="image/*"
                        onChange={(e) => setLabelImage(e.target.files[0])}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                >
                    Upload
                </button>
            </form>
        </div>
    );
}

export default Add_learning;

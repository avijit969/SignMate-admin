import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';

function AdminPractice() {
    const [question, setQuestion] = useState('');
    const [questionVideo, setQuestionVideo] = useState(null);
    const [option1, setOption1] = useState('');
    const [option1Image, setOption1Image] = useState(null);
    const [option2, setOption2] = useState('');
    const [option2Image, setOption2Image] = useState(null);
    const [correctAnswerOption, setCorrectAnswerOption] = useState('');

    const generateUniqueFileName = (file) => {
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileNameWithoutExtension = file.name.replace(`.${fileExtension}`, '');
        return `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        let questionVideoUrl = '';
        if (questionVideo) {
            // Generate unique file name for the question video
            const questionVideoFileName = generateUniqueFileName(questionVideo);

            // Upload question video to Supabase storage bucket
            const { data: videoData, error: videoError } = await supabase.storage
                .from('sign_videos')
                .upload(`public/${questionVideoFileName}`, questionVideo);

            if (videoError) {
                toast.error("Failed to upload question video.");
                return;
            }

            questionVideoUrl = supabase.storage
                .from('sign_videos')
                .getPublicUrl(`public/${questionVideoFileName}`).data.publicUrl;
        }

        let option1ImageUrl = '';
        if (option1Image) {
            // Generate unique file name for option 1 image
            const option1ImageFileName = generateUniqueFileName(option1Image);

            // Upload option 1 image to Supabase storage bucket
            const { data: imageData, error: imageError } = await supabase.storage
                .from('sign_images')
                .upload(`public/${option1ImageFileName}`, option1Image);

            if (imageError) {
                toast.error("Failed to upload option 1 image.");
                return;
            }

            option1ImageUrl = supabase.storage
                .from('sign_images')
                .getPublicUrl(`public/${option1ImageFileName}`).data.publicUrl;
        }

        let option2ImageUrl = '';
        if (option2Image) {
            // Generate unique file name for option 2 image
            const option2ImageFileName = generateUniqueFileName(option2Image);

            // Upload option 2 image to Supabase storage bucket
            const { data: imageData, error: imageError } = await supabase.storage
                .from('sign_images')
                .upload(`public/${option2ImageFileName}`, option2Image);

            if (imageError) {
                toast.error("Failed to upload option 2 image.");
                return;
            }

            option2ImageUrl = supabase.storage
                .from('sign_images')
                .getPublicUrl(`public/${option2ImageFileName}`).data.publicUrl;
        }

        // Insert the practice question details into the practice table
        const { error } = await supabase
            .from('practice')
            .insert([
                {
                    question,
                    question_video_url: questionVideoUrl,
                    option1,
                    option1_image: option1ImageUrl,
                    option2,
                    option2_image: option2ImageUrl,
                    correct_answer_option: parseInt(correctAnswerOption)
                },
            ]);

        if (error) {
            toast.error("Failed to upload practice question details.");
        } else {
            toast.success("Practice question details uploaded successfully.");
            setQuestion('');
            setQuestionVideo(null);
            setOption1('');
            setOption1Image(null);
            setOption2('');
            setOption2Image(null);
            setCorrectAnswerOption('');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Practice Question</h2>
            <form onSubmit={handleUpload}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Question</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Question Video (optional)</label>
                    <input
                        type="file"
                        className="w-full p-2 border rounded"
                        accept="video/*"
                        onChange={(e) => setQuestionVideo(e.target.files[0])}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Option 1</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={option1}
                        onChange={(e) => setOption1(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Option 1 Image (optional)</label>
                    <input
                        type="file"
                        className="w-full p-2 border rounded"
                        accept="image/*"
                        onChange={(e) => setOption1Image(e.target.files[0])}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Option 2</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={option2}
                        onChange={(e) => setOption2(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Option 2 Image (optional)</label>
                    <input
                        type="file"
                        className="w-full p-2 border rounded"
                        accept="image/*"
                        onChange={(e) => setOption2Image(e.target.files[0])}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Correct Answer Option (1 or 2)</label>
                    <input
                        type="number"
                        min="1"
                        max="2"
                        className="w-full p-2 border rounded"
                        value={correctAnswerOption}
                        onChange={(e) => setCorrectAnswerOption(e.target.value)}
                        required
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

export default AdminPractice;

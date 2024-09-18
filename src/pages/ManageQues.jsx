import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import Modal from '../components/Model';
import Loader from '../components/Loader';
import { Button } from '@material-tailwind/react';

/**
 * Manage practice questions
 *
 * This component is used to manage practice questions. It displays a table of all practice questions
 * and allows the user to add, edit or delete questions. When adding or editing a question, a modal is
 * displayed for the user to input the question details. The component also handles the business logic
 * for adding, editing and deleting questions.
 *
 * @return {JSX.Element} The JSX element representing the Manage practice questions component.
 */
function ManageQues() {
    const [questions, setQuestions] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [questionData, setQuestionData] = useState({
        question: '',
        questionVideo: null,
        option1: '',
        option1Image: null,
        option2: '',
        option2Image: null,
        correctAnswerOption: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [currentPage]);

    const fetchQuestions = async () => {
        setLoading(true);
        const { data, error, count } = await supabase
            .from('practice')
            .select('*', { count: 'exact' })
            .range((currentPage - 1) * 5, currentPage * 5 - 1);

        if (error) {
            toast.error("Failed to fetch questions.");
        } else {
            setQuestions(data);
            setTotalPages(Math.ceil(count / 5));
        }
        setLoading(false);
    };

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

    const handleAdd = async () => {
        try {
            const newQuestion = {
                question: questionData.question,
                question_video_url: questionData.questionVideo ? await uploadFile(questionData.questionVideo, "sign_videos") : null,
                option1: questionData.option1,
                option1_image: questionData.option1Image ? await uploadFile(questionData.option1Image, "sign_images") : null,
                option2: questionData.option2,
                option2_image: questionData.option2Image ? await uploadFile(questionData.option2Image, "sign_images") : null,
                correct_answer_option: questionData.correctAnswerOption,
                created_at: new Date()
            };

            const { error } = await supabase
                .from('practice')
                .insert([newQuestion]);

            if (error) {
                console.error('Insert Error:', error.message);
                toast.error("Failed to add new question.");
            } else {
                toast.success("Question added successfully.");
                fetchQuestions();
                setIsAddingQuestion(false);
                setQuestionData({
                    question: '',
                    questionVideo: null,
                    option1: '',
                    option1Image: null,
                    option2: '',
                    option2Image: null,
                    correctAnswerOption: ''
                });
            }
        } catch (error) {
            console.error('Unexpected Error:', error.message);
            toast.error('An unexpected error occurred while adding the question.');
        }
    };

    const handleUpdate = async (id) => {
        try {
            const updates = {
                question: questionData.question,
                question_video_url: questionData.questionVideo ? await uploadFile(questionData.questionVideo, "sign_videos") : undefined,
                option1: questionData.option1,
                option1_image: questionData.option1Image ? await uploadFile(questionData.option1Image, "sign_images") : undefined,
                option2: questionData.option2,
                option2_image: questionData.option2Image ? await uploadFile(questionData.option2Image, "sign_images") : undefined,
                correct_answer_option: questionData.correctAnswerOption,

            };

            // Remove undefined properties from updates object
            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const { error } = await supabase
                .from('practice')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('Update Error:', error.message);
                toast.error("Failed to update question.");
            } else {
                toast.success("Question updated successfully.");
                fetchQuestions();
                setIsModalOpen(false);
                setEditingQuestionId(null);
            }
        } catch (error) {
            console.error('Unexpected Error:', error.message);
            toast.error('An unexpected error occurred while updating the question.');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Fetch existing URLs for deletion
            const { data: question } = await supabase
                .from('practice')
                .select('question_video_url, option1_image, option2_image')
                .eq('id', id)
                .single();

            if (!question) {
                toast.error("Question not found.");
                return;
            }

            // Delete files from storage
            const deleteFiles = async () => {
                const promises = [];

                if (question.question_video_url) {
                    const fileName = new URL(question.question_video_url).pathname.split('/').pop();
                    promises.push(supabase.storage.from('sign_videos').remove([`public/${fileName}`]));
                }
                if (question.option1_image) {
                    const fileName = new URL(question.option1_image).pathname.split('/').pop();
                    promises.push(supabase.storage.from('sign_images').remove([`public/${fileName}`]));
                }
                if (question.option2_image) {
                    const fileName = new URL(question.option2_image).pathname.split('/').pop();
                    promises.push(supabase.storage.from('sign_images').remove([`public/${fileName}`]));
                }

                await Promise.all(promises);
            };

            await deleteFiles();

            // Delete question record
            const { error } = await supabase
                .from('practice')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Delete Error:', error.message);
                toast.error("Failed to delete question.");
            } else {
                toast.success("Question deleted successfully.");
                fetchQuestions();
            }
        } catch (error) {
            console.error('Unexpected Error:', error.message);
            toast.error('An unexpected error occurred while deleting the question.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingQuestionId(null);
        setIsAddingQuestion(false);
        setQuestionData({
            question: '',
            questionVideo: null,
            option1: '',
            option1Image: null,
            option2: '',
            option2Image: null,
            correctAnswerOption: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuestionData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setQuestionData(prev => ({ ...prev, [name]: files[0] }));
    };

    const generateUniqueFileName = (file) => {
        const timestamp = Date.now();
        return `${timestamp}-${file.name}`;
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-6 max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4">Manage Practice Questions</h2>
            <div className='flex justify-start mb-2'>
                <Button onClick={() => { setIsAddingQuestion(true); setIsModalOpen(true); }}
                    color='green'
                >Add Question</Button>
            </div>
            <div className="mb-4 rounded-2xl">
                <table className="min-w-full bg-white border-gray-200 rounded-2xl">
                    <thead className='rounded-2xl border-b'>
                        <tr>
                            <th className="px-2 py-2 text-left">Question</th>
                            <th className="px-2 py-2 text-left">Question Video</th>
                            <th className="px-2 py-2 text-left">Option 1</th>
                            <th className="px-2 py-2 text-left">Option 1 Image</th>
                            <th className="px-2 py-2 text-left">Option 2</th>
                            <th className="px-2 py-2 text-left">Option 2 Image</th>
                            <th className="px-2 py-2 text-left">Correct Answer Option</th>
                            <th className="px-2 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map(question => (
                            <tr key={question.id} className='border-b'>
                                <td className="px-2 py-2">{question.question}</td>
                                <td className="px-2 py-2 ">
                                    {question.question_video_url && (
                                        <div className="">
                                            <video controls width="400" className="mt-2 rounded-xl object-cover">
                                                <source src={question.question_video_url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </td>
                                <td className="px-2 py-2 text-2xl font-bold text-gray-800">{question.option1}</td>
                                <td className="px-2 py-2">
                                    {question.option1_image && (
                                        <img src={question.option1_image} alt={question.option1} className="w-32 h-auto" />
                                    )}
                                </td>
                                <td className="px-2 py-2 text-2xl font-bold text-gray-800">{question.option2}</td>
                                <td className="px-2 py-2">
                                    {question.option2_image && (
                                        <img src={question.option2_image} alt={question.option2} className="w-32 h-auto" />
                                    )}
                                </td>
                                <td className="px-2 py-2 text-2xl">{question.correct_answer_option}</td>
                                <td className="px-2 py-2 flex space-x-2">
                                    <Button onClick={() => { setEditingQuestionId(question.id); setQuestionData({ ...question, questionVideo: null, option1Image: null, option2Image: null }); setIsModalOpen(true); }}
                                        color='green'
                                    >Edit</Button>
                                    <Button color="red" onClick={() => handleDelete(question.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCancel}>
                <h3 className="text-xl font-bold mb-4">{editingQuestionId ? "Edit Question" : "Add Question"}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Question</label>
                        <textarea
                            name="question"
                            value={questionData.question}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded mt-2"
                            rows="4"
                            cols="50"
                            placeholder="Enter question description"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Question Video</label>
                        <input
                            type="file"
                            name="questionVideo"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Option 1</label>
                        <input
                            type="text"
                            name="option1"
                            value={questionData.option1}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                        <label className="block text-sm font-medium mt-2">Option 1 Image</label>
                        <input
                            type="file"
                            name="option1Image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Option 2</label>
                        <input
                            type="text"
                            name="option2"
                            value={questionData.option2}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                        <label className="block text-sm font-medium mt-2">Option 2 Image</label>
                        <input
                            type="file"
                            name="option2Image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Correct Answer Option</label>
                        <select
                            name="correctAnswerOption"
                            value={questionData.correctAnswerOption}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        >
                            <option value='1'>Option 1</option>
                            <option value='2'>Option 2</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button
                            onClick={editingQuestionId ? () => handleUpdate(editingQuestionId) : handleAdd}
                            color="green"
                        >
                            {editingQuestionId ? "Update" : "Add"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ManageQues;

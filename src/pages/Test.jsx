import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const VideoRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [videoBlob, setVideoBlob] = useState(null);
    const [result, setResult] = useState(null);

    const webcamRef = useRef(null);

    const startRecording = () => {
        if (webcamRef.current) {
            const stream = webcamRef.current.stream;

            if (stream) {
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

                let localChunks = [];
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        localChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const completeBlob = new Blob(localChunks, { type: 'video/webm' });
                    const videoUrl = URL.createObjectURL(completeBlob);
                    setVideoUrl(videoUrl);
                    setVideoBlob(completeBlob);
                };

                mediaRecorder.start();
                setMediaRecorder(mediaRecorder);
                setRecording(true);
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const uploadVideo = async () => {
        if (videoBlob) {
            try {
                const formData = new FormData();
                formData.append('file', videoBlob, 'video.webm');

                const response = await axios.post('http://localhost:8000/predict', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Handle response from the backend
                setResult(JSON.stringify(response.data?.prediction));
            } catch (error) {
                alert('Failed to upload video.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className=' text-2xl font-bold p-4 text-purple-700'>Here you can translate sign te text</h1>
            {!videoUrl && (
                <Webcam
                    audio={true}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className=" h-96 rounded-lg shadow-lg w-1/2"
                />
            )}
            <div className="mt-4">
                {!recording && !videoUrl ? (
                    <button
                        onClick={startRecording}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Start Recording
                    </button>
                ) : recording ? (
                    <button
                        onClick={stopRecording}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                    >
                        Stop Recording
                    </button>
                ) : (
                    <div>
                        <video src={videoUrl} controls className="w-full h-96 rounded-lg shadow-lg mb-4" />
                        <button
                            onClick={uploadVideo}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                        >
                            Upload Video
                        </button>
                    </div>
                )}
            </div>
            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-full">
                    <h3 className="text-lg font-bold text-gray-700">Prediction Result:</h3>
                    <p className="text-gray-600">{result}</p>
                </div>
            )}
            {videoUrl && !recording && (
                <button
                    onClick={() => {
                        setVideoUrl(null);
                        setResult(null);
                        setVideoBlob(null); // Clear the video blob
                    }}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600"
                >
                    Record Another Video
                </button>
            )}
        </div>
    );
};

export default VideoRecorder;

import React from 'react';
import ReactDOM from 'react-dom';
import { IoMdClose } from 'react-icons/io';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-900"
                >
                    <IoMdClose size={40} />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;

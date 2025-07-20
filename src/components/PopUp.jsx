import React from 'react'
import Lottie from 'lottie-react';
import successAnimation from '../../public/animations/Success.json'

const PopUp = (props) => {

    const { show, closeBtn = true, onClose, image, message, actions = [] } = props;

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,36,72,0.8)] bg-opacity-10">
            <div className="relative w-full max-w-[300px] p-6 bg-white rounded-lg shadow-lg">
                {closeBtn && <button onClick={onClose}
                    className="absolute top-0 right-2 text-gray-400 hover:text-gray-800 text-2xl cursor-pointer"
                >
                    &times;
                </button>}

                <div className="flex justify-center mb-4">
                    {image === 'successAnimation' ?
                        <Lottie animationData={successAnimation} loop={true} />
                        :
                        <img src={image} />
                    }
                </div>

                <p className="text-center text-md font-semibold text-gray-800 mb-6">{message}</p>

                <div className="flex justify-center gap-3">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className={`px-4 py-2 rounded ${action.className || 'bg-blue-600'} text-white cursor-pointer`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PopUp

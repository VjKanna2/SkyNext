'use client';
import react from 'react';
import Lottie from 'lottie-react';
import loader from '../../public/animations/Loader.json'

const Loader = () => {
    return (
        <div className="spinner">
            <Lottie animationData={loader} loop={true} style={{ width: '230px', height: '230px' }} />
        </div>
    )
}

export default Loader


import { useEffect, useRef } from 'react';

const Backgrounds = ({ videoUrl, speed = 1, children, centerY = false }) => {

    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.playbackRate = speed;
        }
    }, [videoUrl]);

    return (
        <div className="relative w-full h-screen overflow-hidden">

            <video
                ref={videoRef}
                key={videoUrl}
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your Browser does not support the Video tag.
            </video>

            <div className={`absolute top-0 left-0 w-full h-full overflow-y-auto ${centerY ? 'flex items-center justify-center h-screen' : ''}`}>
                {children}
            </div>

        </div>
    );
}

export default Backgrounds
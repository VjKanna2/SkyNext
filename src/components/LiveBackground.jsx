'use client'
import { useEffect, useRef, useState } from 'react';

const CloudsBackground = ({ children, effectName = 'CLOUDS', centerY = false }) => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined' || vantaEffect || !vantaRef.current) return;

        const loadScripts = async () => {
            if (!window.THREE) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }

            if (!window.VANTA?.[effectName]) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = `https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${effectName.toLowerCase()}.min.js`;
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }

            if (window.VANTA?.[effectName] && !vantaEffect) {
                const effect = window.VANTA[effectName]({
                    el: vantaRef.current,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    skyColor: 0x31a4d4,
                    speed: 0.9,
                });
                setVantaEffect(effect);
            }
        };

        loadScripts();

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect, effectName]);

    return (
        <div className="relative w-full h-screen overflow-hidden">

            <div ref={vantaRef} className="absolute top-0 left-0 w-full h-full z-0" />

            <div className="relative z-[1] w-full h-full">
                <div className={`w-full h-full overflow-y-auto ${centerY ? 'flex items-center justify-center h-full' : ''}`}>
                    {children}
                </div>
            </div>

        </div>
    );
}

export default CloudsBackground

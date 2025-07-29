import { CLEAR_SKY, CLOUDINARY_BASE, CLOUDS, DRIZZLE, DUST, EVENING, FOG, NIGHT, RAINY, SNOW, SUNNY, THUNDER } from "./Urls";

// Latitude & Longitude
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            reject('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(error.message || 'Permission denied');
            }
        );
    });
};

// CamelCase
export function camelCase(value) {
    if (typeof value !== 'string') return '';
    return value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Current Time
export function currentTime() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 16) {
        return 'noon';
    } else if (hour >= 16 && hour < 18) {
        return 'evening';
    } else {
        return 'night';
    }
};

// Dynamic Background
export function setDynamicBackground(weather) {
    const videoSrc = {
        cloud: CLOUDS,

        clear: CLEAR_SKY,
        noon: CLEAR_SKY,

        rain: RAINY,
        drizzle: DRIZZLE,

        dust: DUST,

        mist: FOG,
        fog: FOG,
        smoke: FOG,
        smog: FOG,
        haze: FOG,

        snow: SNOW,

        sunny: SUNNY,
        morning: SUNNY,

        thunder: THUNDER,

        evening: EVENING,
        night: NIGHT,
    }

    for (const key in videoSrc) {
        if (weather.includes(key)) {
            return `${CLOUDINARY_BASE + videoSrc[key]}`
        }
    }
};
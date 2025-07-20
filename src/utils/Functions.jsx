// GET - Latitude & Longitude
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
}

export const ForceLogOut = async () => {
    if (typeof window !== 'undefined') {
        const { logOut } = await import('@/app/slices/User');
        const { weather_store } = await import('@/app/store/store');
        weather_store.dispatch(logOut());
    }
};

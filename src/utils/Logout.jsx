export const ForceLogOut = async () => {
    if (typeof window !== 'undefined') {
        const { logOut } = await import('@/app/login/LoginSlice');
        const { weather_store } = await import('@/app/store/store');
        weather_store.dispatch(logOut());
    }
};

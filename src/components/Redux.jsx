'use client';
import { weather_store } from '@/app/store/store';
import { Provider } from 'react-redux';

const ReduxProvider = ({ children }) => {
    return <Provider store={weather_store}>{children}</Provider>
}
export default ReduxProvider

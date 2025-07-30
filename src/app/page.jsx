'use client'
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { LOCATION_SEARCH } from '@/utils/Urls';
import { PostApi, GetApi } from '@/lib/ApiCall';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, loggedUserHome, loggedUserId } from '@/app/slices/User';
import { camelCase, getUserLocation, setDynamicBackground } from '@/utils/Functions';
import Backgrounds from '@/components/Backgrounds';
import WeatherReport from './WeatherReport';
import PopUp from '@/components/PopUp';
import Loader from '@/components/Loader';
import '@/styles/global.css';

const Home = () => {

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const userId = useSelector(loggedUserId);
    const home = useSelector(loggedUserHome);

    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState({});

    const [srcVideo, setSrcVideo] = useState('videos/Sunny.mp4');
    const [videoSpeed, setVideoSpeed] = useState(1);

    const [popup, setPopup] = useState({
        show: false,
        message: '',
        image: '',
        actions: []
    });

    useEffect(() => {
        autoWeather();
    }, [userId]);

    const autoWeather = async () => {
        if (userId !== '' && home === '') userBasedWeather();
        else if (userId !== '' && (home !== '' && home?.latitude !== '' && home?.location !== '')) {
            userBasedWeather(home.latitude, home.longitude);
        } else if (userId !== '' && (home !== '' && home.place !== '')) {
            getWeather(home.place);
        } else getWeather('Trichy');
    }

    const setWeatherState = (weatherDetails) => {

        const lat = weatherDetails.coord?.lat.toFixed(2) + "° " + (weatherDetails.coord?.lat >= 0 ? "N" : "S");
        const lon = weatherDetails.coord?.lon.toFixed(2) + "° " + (weatherDetails.coord?.lon >= 0 ? "E" : "W");

        const data = {
            location: `${weatherDetails.name} (${lat}, ${lon})`,

            weather: weatherDetails.weather[0].main,
            weatherDesc: weatherDetails.weather[0].description,
            icon: weatherDetails.weather[0].icon,

            temperature: weatherDetails.main.temp,
            feelsLike: weatherDetails.main.feels_like,
            minTemp: weatherDetails.main.temp_min,
            maxTemp: weatherDetails.main.temp_max,
            humidity: weatherDetails.main.humidity,
            pressure: weatherDetails.main.pressure,
            seaLevelPressure: weatherDetails.main.sea_level,
            groundLevelPressure: weatherDetails.main.grnd_level,

            windSpeed: `${weatherDetails.wind?.speed.toFixed(1)} m/s`,
            windGusts: weatherDetails.wind?.gust?.toFixed(1) ?
                `${weatherDetails.wind.gust.toFixed(1)} m/s`
                : 'N/A',
            windDirection: weatherDetails.wind?.deg,

            sunrise: weatherDetails.sys.sunrise,
            sunset: weatherDetails.sys.sunset,

            visibility: weatherDetails.visibility / 1000,

            lastUpdated: weatherDetails.dt
        }

        setWeatherData(data);
    }

    const addHome = async (place, lat, lon) => {
        try {
            setIsLoading(true);
            const response = await PostApi('Location/Home', { place: place, latitude: lat, longitude: lon });
            if (response.data !== null && response.data.Status === 'Success') {
                dispatch(getUserData());
                setPopup({ show: true, image: 'successAnimation', message: response.data.Message, actions: [] });
            }
        } catch (error) {
            setPopup({ show: true, image: 'images/Alert.svg', message: response.data.Message, actions: [] });
        } finally {
            setIsLoading(false);
        }
    }

    const userBasedWeather = async (lat, lon) => {
        try {

            let location
            if (!lat && !lon) location = await getUserLocation();
            else location = { latitude: lat, longitude: lon }

            if (location.latitude !== '' && location.longitude !== '') {
                setIsLoading(true);
                const response = await PostApi('Weather', location)
                const data = response.data;
                if (data !== null && data.Status === 'Success') {
                    const weather = (data.Data.weather[0]?.main).toLowerCase();
                    setSrcVideo(setDynamicBackground(weather));
                    setWeatherState(data?.Data);
                    if (home === '') {
                        setPopup({
                            show: true,
                            message: 'Would You Like To Add Your Current Location As Home?',
                            image: 'images/Ask.png',
                            actions: [
                                { label: 'NO', className: 'bg-red-600', onClick: closePopUp },
                                {
                                    label: 'YES',
                                    className: 'bg-green-700',
                                    onClick: () => {
                                        closePopUp();
                                        addHome(data.Data.name, location.latitude, location.longitude);
                                    }
                                }
                            ]
                        });
                    }
                } else if (data.Status === 'Not Found') {
                    setPopup({ show: true, message: `${camelCase(location)} - ${camelCase(data.Message)}`, image: 'images/Alert.svg', actions: [] });
                }
            } else if (response.status === 401) {
                setPopup({ show: true, message: 'Session Ended. Please Login To Continue', image: 'images/SessionEnded.svg', actions: [] });
            }
        } catch (error) {
            console.error('Error Getting Weather', error);
            setWeatherData({});
        } finally {
            setLocation('');
            setIsLoading(false);
        }
    }

    const getWeather = async (place) => {
        if (location == '' && !place) return;
        if (userId === "" && location !== 'Trichy' && !place) {
            setPopup({ show: true, message: 'Please Login To Continue', image: 'images/LoginToContinue.svg', actions: [] });
            return;
        }
        try {
            setIsLoading(true);
            const response = await GetApi(LOCATION_SEARCH + (location ? location : place));
            const data = response.data;
            if (data !== null && data?.Status === 'Success') {
                const weatherBackground = (data?.Data.weather[0]?.main).toLowerCase();
                setSrcVideo(setDynamicBackground(weatherBackground));
                setWeatherState(data?.Data);
            } else if (response.status === 401) {
                setPopup({ show: true, message: 'Please Login To Continue', image: 'images/LoginToContinue.svg', actions: [] });
            } else if (data.Status === 'Not Found') {
                setPopup({ show: true, message: `${camelCase(location)} - ${camelCase(data.Message)}`, image: 'images/Alert.svg', actions: [] });
            }
        } catch (error) {
            console.error('Error Fetching Weather', error);
            setWeatherData({});
        } finally {
            setLocation('');
            setIsLoading(false);
        }
    }

    const closePopUp = () => {
        setPopup({
            show: false,
            message: '',
            image: '',
            actions: []
        });
    }

    return (
        <div className='m-0 p-0'>
            <Backgrounds videoUrl={srcVideo}>
                <Header />
                <div className="w-full p-4 sm:p-8 sm:pt-4 md:p-12 md:pt-8">
                    <WeatherReport
                        userId={userId}
                        location={location}
                        setLocation={setLocation}
                        getWeather={getWeather}
                        userBasedWeather={userBasedWeather}
                        weatherData={weatherData}
                    />
                </div>
            </Backgrounds>
            {isLoading && <Loader />}
            <PopUp
                show={popup.show}
                onClose={closePopUp}
                closeBtn={popup.actions.length < 1 ? true : false}
                message={popup.message}
                image={popup.image}
                actions={popup.actions}
            />
        </div>
    )
}

export default Home
'use client'
import React from 'react';
import weatherStyles from '@/styles/Weather.module.css';
import { camelCase } from '@/utils/Functions';

const WeatherReport = ({ userId, location, setLocation, getWeather, userBasedWeather, weatherData }) => {

    const unixToIST = (unixTimestamp) => {
        return new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(new Date(unixTimestamp * 1000));
    };

    const windDegreeToDirection = (deg) => {
        const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
        return directions[Math.round(deg / 45) % 8];
    };

    const fahrenheitToCelsius = (f) => {
        return ((f - 32) * 5 / 9).toFixed(2);
    }

    const celsiusToFahrenheit = (c) => {
        return ((c * 9 / 5) + 32).toFixed(2);
    }

    console.log('Weather Data :', weatherData);

    return (
        <div className="glass-effect flex flex-wrap items-stretch justify-between w-full p-0 sm:p-4">

            <div className="flex items-center justify-between w-full p-6 md:w-[60%] mx-auto sm:mb-4">
                <input type="text"
                    placeholder='Enter Location'
                    value={location}
                    className={`${weatherStyles.textBox} ${userId !== '' ? 'w-[60%]' : 'w-[72%]'} py-2 px-4 outline-0`}
                    onChange={(e) => {
                        const value = e.target.value;
                        const filtered = value.replace(/[0-9]/g, '');
                        setLocation(filtered);
                    }}
                />
                <button type='button'
                    className="w-[25%] p-2 rounded-lg bg-[#0957DE] text-white font-[var(--custom-open-sans)] cursor-pointer"
                    onClick={() => getWeather()}
                >
                    Search
                </button>
                {userId !== "" &&
                    <button type='button'
                        className="w-[10%] p-2 rounded-lg bg-white text-[#0957DE] font-[var(--custom-open-sans)] cursor-pointer"
                        onClick={() => userBasedWeather()}
                    >
                        📍
                    </button>
                }
            </div>

            {weatherData &&
                Object.keys(weatherData).length > 0 &&
                <div className="p-3 w-full h-full lg:w-2/3">

                    <div className={`currentWeather ${weatherStyles.gridBox} p-4`}>

                        <div className="currentWeather_location">
                            <h1 className="text-xl font-bold text-gray-800">📍 {weatherData.location}</h1>
                        </div>

                        <div className="currentWeather_condition flex flex-col md:flex-row items-center justify-between mb-6">
                            <div className="currentWeather_condition-weather flex items-center">
                                <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} className='mr-2 w-32' />
                                <div className='flex flex-col'>
                                    <p className="font-semibold text-gray-800 text-3xl">{camelCase(weatherData.weather)}</p>
                                    <p className="text-md text-gray-600">{camelCase(weatherData.weatherDesc)}</p>
                                </div>
                            </div>
                            <div className="currentWeather_condition-temprature text-center">
                                <p className="text-5xl font-bold text-gray-800">{weatherData.temperature}°C</p>
                                <p className="text-sm text-gray-500">Feels like {weatherData.feelsLike}°C</p>
                                <p className="text-sm text-gray-500">↕ Min/Max: {weatherData.minTemp}°C / {weatherData.maxTemp}°C</p>
                            </div>
                        </div>

                        <div className="flex w-full sm:w-[70%] md:w-[60%] lg:w-[50%] m-auto justify-between items-center mb-6">
                            <div className="w-[48%] bg-yellow-100 rounded-lg p-3 hover:bg-yellow-200 transition col-span-1">
                                <p className="text-sm text-yellow-700">
                                    🌅 Sunrise
                                </p>
                                <p className="text-lg font-medium text-yellow-800">
                                    {weatherData.sunrise !== undefined ? unixToIST(weatherData.sunrise) : '--:--'}
                                </p>
                            </div>
                            <div className="w-[48%] bg-orange-100 rounded-lg p-3 hover:bg-orange-200 transition col-span-1">
                                <p className="text-sm text-orange-700">
                                    🌇 Sunset
                                </p>
                                <p className="text-lg font-medium text-orange-800">
                                    {weatherData.sunset !== undefined ? unixToIST(weatherData.sunset) : '--:--'}
                                </p>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            ⏰ Last updated: {weatherData.lastUpdated !== undefined ? unixToIST(weatherData.lastUpdated) : '--:--'} IST
                        </div>

                    </div>

                </div>
            }

            {weatherData &&
                Object.keys(weatherData).length > 0 &&
                <div className="p-3 w-full lg:w-1/3 font-[var(--font-roboto)]">
                    <div className={`${weatherStyles.gridBox} p-4`}>
                        <div className="flex flex-wrap items-center mb-6">
                            <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition mr-2 mb-2">
                                <p className="text-sm text-gray-600">💧 Humidity</p>
                                <p className="text-lg font-medium text-gray-800">{weatherData.humidity}%</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition mr-2 mb-2">
                                <p className="text-sm text-gray-600">🔭 Visibility</p>
                                <p className="text-lg font-medium text-gray-800">{weatherData.visibility} km</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition mr-2 mb-2">
                                <p className="text-sm text-gray-600">📈 Sea Level Pressure</p>
                                <p className="text-lg font-medium text-gray-800">{weatherData.seaLevelPressure} hPa</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition mr-2 mb-2">
                                <p className="text-sm text-gray-600">📉 Ground Level Pressure</p>
                                <p className="text-lg font-medium text-gray-800">{weatherData.groundLevelPressure} hPa</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition mr-2 mb-2">
                                <p className="text-sm text-gray-600">💨 Wind</p>
                                <p className="text-lg font-medium text-gray-800">
                                    {`${weatherData.windSpeed} (Gusts: ${weatherData.windGusts})`} from {windDegreeToDirection(weatherData.windDirection)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div >
    )
}

export default WeatherReport

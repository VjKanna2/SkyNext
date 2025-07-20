'use client'
import React, { useEffect, useState } from 'react'
import { getUserData, loggedUserName, logOut, sessionStatus } from '@/app/login/LoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { PostApi } from '@/lib/ApiCall';
import { LOGOUT } from '@/utils/Urls';
import PopUp from './PopUp';
import Loader from './Loader';

const Header = () => {

    const dispatch = useDispatch();
    const route = useRouter();

    const userName = useSelector(loggedUserName);
    const session = useSelector(sessionStatus);
    const isLoggedIn = session === 'loggedIn' ? true : false;

    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userClicked, setUserClicked] = useState(false);

    const [popup, setPopup] = useState({
        show: false,
        message: '',
        image: '',
    });

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        route.prefetch('/login');
        route.prefetch('/');
        if (userName !== '') {
            route.prefetch(`/profile/${userName}`);
        }
    }, []);

    useEffect(() => {
        if (session === 'loggedOut') {
            logOutApi();
            if (userClicked) {
                setPopup({ show: true, image: 'successAnimation', message: 'Logged Out Successfully!' });
                setUserClicked(false);
            } else {
                setPopup({ show: true, image: 'images/SessionEnded.png', message: 'Oops! Session Ended. Please Login Again' });
            }
        } else {
            setPopup({ show: false, image: '', message: '' });
        }
    }, [session]);

    useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);

    const navigateFromMenu = async (url) => {
        setIsLoading(true);
        setIsPopupOpen(false);

        if (url === 'logout') {
            try {
                const result = await dispatch(logOut()).unwrap();
                if (result?.Message === 'Logged Out Successfully') {
                    route.push('/');
                }
            } catch (err) {
                console.error("Logout failed", err);
            }
        } else {
            route.push(url);
        }
        setIsLoading(false);
    }

    const logOutApi = async () => {
        try {
            setIsLoading(true);
            await PostApi(LOGOUT);
        } catch (error) {
            console.error('Logout Error :', error);
        } finally {
            setIsLoading(false);
        }
    }

    const popUpContents = [
        { label: 'Home', onClick: () => navigateFromMenu('/') },
        ...(isLoggedIn ? [
            { label: 'Profile', onClick: () => navigateFromMenu(`/profile/${userName}`) },
            {
                label: 'Log out', onClick: () => {
                    navigateFromMenu('logout');
                    setUserClicked(true);
                }
            },
        ] : [
            { label: 'Login', onClick: () => navigateFromMenu('/login') },
        ])
    ];

    return (
        <div className='w-full py-3 px-6 flex justify-between items-center'>
            <img src="/images/Icon.png" data-aos="zoom-in" className='w-[75px] rounded-full' />

            <div className="relative">

                {userName !== '' ?
                    <p onClick={togglePopup} data-aos="zoom-in" className='text-white text-2xl bg-[#0957DE] py-2 px-4 rounded-full border-white cursor-pointer focus:ring-2 focus:ring-blue-500'>
                        {userName?.charAt(0).toUpperCase()}
                    </p>
                    :
                    <img src='/images/User.jpg' data-aos="zoom-in" className='notYetLoggedIn cursor-pointer' onClick={togglePopup} />
                }

                {isPopupOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[2]">
                        <div className="px-4 py-2 text-sm">
                            Hey, <span className='text-[#0957DE] font-bold'>{isLoggedIn ? userName : 'User'}!</span>
                        </div>
                        <ul>
                            {popUpContents.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={item.onClick}
                                    className="text-sm font-semibold pl-6 py-2 rounded-md hover:bg-gray-100 hover:tracking-wider transition-all duration-300 ease-in-out cursor-pointer"
                                >
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isLoading && <Loader />}
            <PopUp
                show={popup.show}
                onClose={() => setPopup({ show: false, message: '', image: '' })}
                message={popup.message}
                image={popup.image}
            />
        </div>
    )
}

export default Header

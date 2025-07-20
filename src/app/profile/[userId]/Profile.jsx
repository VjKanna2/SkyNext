'use client'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loggedUserHome, loggedUserJoinedOn, loggedUserMail, loggedUserName } from '@/app/login/LoginSlice'
import { useRouter } from 'next/navigation'
import profileStyles from '@/styles/Profile.module.css'

const Profile = ({ paramsValue }) => {

    const router = useRouter();

    const name = useSelector(loggedUserName);
    const mail = useSelector(loggedUserMail);
    const joinedOn = useSelector(loggedUserJoinedOn);
    const home = useSelector(loggedUserHome);

    useEffect(() => {
        if (paramsValue !== name) router.replace('/');
    }, [paramsValue, name]);

    return (
        <div className=" PROFILE_GRID
            grid gap-2 grid-cols-6 grid-rows-5 
            md:grid-cols-5 md:grid-rows-4"
        >
            <div className={`flex flex-col ${profileStyles.gridBox}
                col-span-6 row-span-2 
                md:col-span-2 md:row-span-3`}
            >
                <div className="mx-auto">
                    <img src="/images/User.jpg" className='w-[95px] md:w-[250px] rounded-full' />
                    <p className={profileStyles.name}>{name}</p>
                </div>
            </div>
            <div
                className={`flex flex-col ${profileStyles.gridBox}
                    col-span-3 row-start-3
                    md:col-start-3 md:col-span-3 md:row-start-auto
                `}
            >
                <label className={profileStyles.contentHeading} htmlFor="mail">Mail ID</label>
                <p className={profileStyles.contentValue}>{mail}</p>
            </div>
            <div
                className={`flex flex-col ${profileStyles.gridBox}
                    col-start-4 col-span-3 row-start-3
                    md:col-start-3 md:col-span-3 md:row-start-2
                `}
            >
                <label className={profileStyles.contentHeading} htmlFor="joinedOn">Joined On</label>
                <p className={profileStyles.contentValue}>{new Date(joinedOn).toLocaleDateString("en-GB")}</p>
            </div>
            <div
                className={`flex flex-col ${profileStyles.gridBox}
                    col-span-6 row-start-4
                    md:col-start-3 md:col-span-3 md:row-start-3 md:row-span-2
                `}
            >
                <label className={profileStyles.contentHeading} htmlFor="Recent">Home</label>
                <p className={profileStyles.contentValue}>{home.place}</p>
            </div>
        </div>
    )
}

export default Profile
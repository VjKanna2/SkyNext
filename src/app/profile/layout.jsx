'use client'
import React from 'react'
import Header from '@/components/Header'
import profileStyles from '@/styles/Profile.module.css'
import Backgrounds from '@/components/Backgrounds'
import { currentTime, setDynamicBackground } from '@/utils/Functions'

const layout = ({ children }) => {

    return (
        <Backgrounds centerY videoUrl={setDynamicBackground(currentTime())} speed={0.7}>
            <div className='w-full h-full'>
                <Header />
                <div className="profileSection my-8 mx-5 sm:mx-10">
                    <div className="glass-effect p-5 sm:p-10 rounded-lg">
                        <p className={`${profileStyles.title} mb-2`}>
                            Profile
                        </p>
                        {children}
                    </div>
                </div>
            </div>
        </Backgrounds>
    )
}

export default layout

import React from 'react'
import Header from '@/components/Header'
import profileStyles from '@/styles/Profile.module.css'

const layout = ({ children }) => {

    return (
        <div className='w-full h-full'>
            <Header />
            <div className="profileSection my-8 mx-10">
                <div className="glass-effect content-spacing rounded-lg">
                    <p className={`${profileStyles.title} mb-3`}>
                        Profile
                    </p>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout

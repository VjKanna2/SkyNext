import React from 'react'

const Spinner = ({ color = 'blue-500' }) => {
    return (
        <div
            className={`
                inline-block
                animate-spin
                rounded-full
                border-4
                border-solid
                border-t-transparent
                border-${color}
                w-6 h-6
            `}
        />
    )
}

export default Spinner
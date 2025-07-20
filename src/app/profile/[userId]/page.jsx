import React from 'react'
import Profile from './Profile';

const UserProfile = ({ params }) => {
    const paramsValue = params.userId;
    return <Profile paramsValue={paramsValue} />
}

export default UserProfile

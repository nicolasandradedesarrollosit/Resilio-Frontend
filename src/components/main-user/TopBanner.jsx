import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../../styles/main-user/topBanner.css';

function TopBanner() {
    const { banner, loading } = useContext(UserContext);

    if (loading || !banner || !banner.content) {
        return null;
    }

    return (
        <div className='banner-top'>
            <p className='banner-message'>{banner.content}</p>
        </div>
    );
}

export default TopBanner;
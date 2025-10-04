import React, { useEffect, useState } from 'react';

function TopBanner() {
    const [bannerData, setBannerData] = useState(null);
    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/banner`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if(!response.ok) throw new Error('Error en banner data');

                const result = await response.json();

                if(result.ok && result.data) {
                    setBannerData(result.data); 
                }
            }
            catch (err) {
                console.error('Error en banner data', err);   
            }
        }
        fetchBannerData();
    }, []);
    return (
        <>
            <div className='banner-top'>
                {
                    bannerData && (
                        <p className='banner-message'>{bannerData.content}</p>
                    )
                }

            </div>
        </>

    );
}

export default TopBanner;
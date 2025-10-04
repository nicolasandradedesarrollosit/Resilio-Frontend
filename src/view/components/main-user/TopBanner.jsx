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
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                console.log('API URL:', import.meta.env.VITE_API_URL);
                
                if(!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Error en banner data: ${response.status}`);
                }

                const result = await response.json();
                console.log('Result:', result);

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
import React, { useEffect, useState } from 'react';
import '../../../styles/main-user/top-banner.css'

function TopBanner() {
    const [bannerData, setBannerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/banner`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if(!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Error en banner data: ${response.status}`);
                }

                const result = await response.json();

                setBannerData(result); 
                
            }
            catch (err) {
                console.error('Error en banner data', err);   
            }
            finally {
                setLoading(false);
            }
        }
        fetchBannerData();
    }, []);

    if (loading) {
        return null;
    }

    if (!bannerData || !bannerData.content) {
        return null;
    }

    return (
        <div className='banner-top'>
            <p className='banner-message'>{bannerData.content}</p>
        </div>
    );
}

export default TopBanner;
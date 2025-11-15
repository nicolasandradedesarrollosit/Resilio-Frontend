import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContextOauth';
import { getEvents } from '../../helpers/eventsFunctions';
import { getBenefits } from '../../helpers/benefitFunctions';
import { getBannerData } from '../../helpers/bannerData';
import { getMyBenefits } from '../../helpers/myBenefitsFunctions';

export const UserContext = createContext();


export default function UserProvider({ children }) {
    const { userData } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myBenefits, setMyBenefits] = useState([]);
    const userId = userData?.id;

    // Reset all user-specific data when user changes or logs out
    useEffect(() => {
        if (!userData) {
            setEvents([]);
            setBenefits([]);
            setBanner(null);
            setMyBenefits([]);
            setError(null);
            setLoading(false);
        }
    }, [userData]);

    
    const loadAllUserData = useCallback(async () => {
        if (!userData || !userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [eventsResult, benefitsResult, bannerResult, myBenefitsResult] = await Promise.allSettled([
                getEvents(),
                getBenefits(),
                getBannerData(),
                getMyBenefits(userId)
            ]);

            if (eventsResult.status === 'fulfilled') {
                const eventsData = eventsResult.value;
                if (Array.isArray(eventsData)) {
                    setEvents(eventsData);
                } else if (eventsData?.ok && Array.isArray(eventsData.data)) {
                    setEvents(eventsData.data);
                } else if (eventsData?.data && Array.isArray(eventsData.data)) {
                    setEvents(eventsData.data);
                } else {
                    setEvents([]);
                }
            } else {
                setEvents([]);
            }

            if (benefitsResult.status === 'fulfilled') {
                const benefitsData = benefitsResult.value;
                if (Array.isArray(benefitsData)) {
                    setBenefits(benefitsData);
                } else if (benefitsData?.ok && Array.isArray(benefitsData.data)) {
                    setBenefits(benefitsData.data);
                } else if (benefitsData?.data && Array.isArray(benefitsData.data)) {
                    setBenefits(benefitsData.data);
                } else {
                    setBenefits([]);
                }
            } else {
                setBenefits([]);
            }

            if (bannerResult.status === 'fulfilled') {
                const bannerData = bannerResult.value;
                if (bannerData?.ok && bannerData.data) {
                    setBanner(bannerData.data);
                } else if (bannerData?.data) {
                    setBanner(bannerData.data);
                } else if (bannerData && !bannerData.ok) {
                    setBanner(bannerData);
                } else {
                    setBanner(null);
                }
            } else {
                setBanner(null);
            }

            if (myBenefitsResult.status === 'fulfilled') {
                const myBenefitsData = myBenefitsResult.value;
                if (Array.isArray(myBenefitsData)) {
                    setMyBenefits(myBenefitsData);
                } else if (myBenefitsData?.ok && Array.isArray(myBenefitsData.data)) {
                    setMyBenefits(myBenefitsData.data);
                } else if (myBenefitsData?.data && Array.isArray(myBenefitsData.data)) {
                    setMyBenefits(myBenefitsData.data);
                } else {
                    setMyBenefits([]);
                }
            } else {
                setMyBenefits([]);
            }
        } catch (err) {
            setError(err.message || 'Error al cargar datos del usuario');
        } finally {
            setLoading(false);
        }
    }, [userData, userId]);

    
    const refreshEvents = useCallback(async () => {
        try {
            const eventsData = await getEvents();
            if (eventsData?.data && Array.isArray(eventsData.data)) {
                setEvents(eventsData.data);
            } else if (Array.isArray(eventsData)) {
                setEvents(eventsData);
            } else {
                setEvents([]);
            }
        } catch (err) {
        }
    }, []);

    
    const refreshBenefits = useCallback(async () => {
        try {
            const benefitsData = await getBenefits();
            if (benefitsData?.data && Array.isArray(benefitsData.data)) {
                setBenefits(benefitsData.data);
            } else if (Array.isArray(benefitsData)) {
                setBenefits(benefitsData);
            } else {
                setBenefits([]);
            }
        } catch (err) {
        }
    }, []);

    
    const refreshBanner = useCallback(async () => {
        try {
            const bannerData = await getBannerData();
            if (bannerData?.data) {
                setBanner(bannerData.data);
            } else if (bannerData && typeof bannerData === 'object') {
                setBanner(bannerData);
            } else {
                setBanner(null);
            }
        } catch (err) {
        }
    }, []);

    
    const refreshAllData = useCallback(async () => {
        await loadAllUserData();
    }, [loadAllUserData]);

    useEffect(() => {
        if (userData && userId) {
            loadAllUserData();
        }
    }, [userData, userId, loadAllUserData]);

    const value = {
        userData,
        
        events,
        benefits,
        banner,
        myBenefits,
        loading,
        error,

        refreshEvents,
        refreshBenefits,
        refreshBanner,
        refreshAllData,

        setEvents,
        setBenefits,
        setBanner
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

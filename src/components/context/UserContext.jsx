import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContextOauth';
import { getEvents } from '../../helpers/eventsFunctions';
import { getBenefits } from '../../helpers/benefitFunctions';
import { getBannerData } from '../../helpers/bannerData';

export const UserContext = createContext();


export default function UserProvider({ children }) {
    const { userData } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const loadAllUserData = useCallback(async () => {
        if (!userData) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [eventsResult, benefitsResult, bannerResult] = await Promise.allSettled([
                getEvents(),
                getBenefits(),
                getBannerData()
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

        } catch (err) {
            setError(err.message || 'Error al cargar datos del usuario');
        } finally {
            setLoading(false);
        }
    }, [userData]);

    
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
        if (userData) {
            loadAllUserData();
        }
    }, [userData, loadAllUserData]);

    const value = {
        userData,
        
        events,
        benefits,
        banner,
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

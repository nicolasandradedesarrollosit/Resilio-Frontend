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
            console.log('[UserContext] No hay userData o userId, saliendo...', { userData, userId });
            setLoading(false);
            return;
        }

        console.log('[UserContext] Iniciando carga de datos para userId:', userId);
        setLoading(true);
        setError(null);

        try {
            const [eventsResult, benefitsResult, bannerResult, myBenefitsResult] = await Promise.allSettled([
                getEvents(),
                getBenefits(),
                getBannerData(),
                getMyBenefits(userId)
            ]);

            console.log('[UserContext] Resultados recibidos:', {
                events: eventsResult.status,
                benefits: benefitsResult.status,
                banner: bannerResult.status,
                myBenefits: myBenefitsResult.status
            });

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
                console.log('[UserContext] myBenefits data recibida:', myBenefitsData);
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
                console.error('[UserContext] myBenefits falló:', myBenefitsResult.reason);
                setMyBenefits([]);
            }
        } catch (err) {
            console.error('[UserContext] Error en loadAllUserData:', err);
            setError(err.message || 'Error al cargar datos del usuario');
        } finally {
            console.log('[UserContext] Finalizando carga, setLoading(false)');
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

    
    const refreshMyBenefits = useCallback(async () => {
        if (!userId) return;
        try {
            const myBenefitsData = await getMyBenefits(userId);
            if (Array.isArray(myBenefitsData)) {
                setMyBenefits(myBenefitsData);
            } else if (myBenefitsData?.ok && Array.isArray(myBenefitsData.data)) {
                setMyBenefits(myBenefitsData.data);
            } else if (myBenefitsData?.data && Array.isArray(myBenefitsData.data)) {
                setMyBenefits(myBenefitsData.data);
            } else {
                setMyBenefits([]);
            }
        } catch (err) {
            console.error('[UserContext] Error al recargar myBenefits:', err);
        }
    }, [userId]);

    
    const refreshAllData = useCallback(async () => {
        await loadAllUserData();
    }, [loadAllUserData]);

    useEffect(() => {
        if (userData && userId) {
            loadAllUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, userId]); // Solo ejecutar cuando userData o userId cambien, no cuando loadAllUserData cambie

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
        refreshMyBenefits,
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

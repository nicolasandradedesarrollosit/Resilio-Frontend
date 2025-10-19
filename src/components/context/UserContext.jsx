import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContextOauth';
import { getEvents } from '../../helpers/eventsFunctions';
import { getBenefits } from '../../helpers/benefitFunctions';
import { getBannerData } from '../../helpers/bannerData';

export const UserContext = createContext();

/**
 * Provider del contexto de usuario común
 * Precarga y mantiene en caché los datos necesarios para usuarios normales
 */
export default function UserProvider({ children }) {
    const { userData } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Carga todos los datos necesarios para el usuario
     */
    const loadAllUserData = useCallback(async () => {
        if (!userData) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Cargar eventos, beneficios y banner en paralelo
            const [eventsResult, benefitsResult, bannerResult] = await Promise.allSettled([
                getEvents(),
                getBenefits(),
                getBannerData()
            ]);

            // Procesar eventos
            if (eventsResult.status === 'fulfilled') {
                const eventsData = eventsResult.value;
                console.log('📅 Eventos recibidos:', eventsData);
                // Verificar si la respuesta tiene estructura {ok, data} o es directamente un array
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
                console.error('Error cargando eventos:', eventsResult.reason);
                setEvents([]);
            }

            // Procesar beneficios
            if (benefitsResult.status === 'fulfilled') {
                const benefitsData = benefitsResult.value;
                console.log('🎁 Beneficios recibidos:', benefitsData);
                // Verificar si la respuesta tiene estructura {ok, data} o es directamente un array
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
                console.error('Error cargando beneficios:', benefitsResult.reason);
                setBenefits([]);
            }

            // Procesar banner
            if (bannerResult.status === 'fulfilled') {
                const bannerData = bannerResult.value;
                console.log('🎪 Banner recibido:', bannerData);
                // Verificar si la respuesta tiene estructura {ok, data} o es un objeto directo
                if (bannerData?.ok && bannerData.data) {
                    setBanner(bannerData.data);
                } else if (bannerData?.data) {
                    setBanner(bannerData.data);
                } else if (bannerData && !bannerData.ok) {
                    // Si es un objeto directo sin .ok ni .data
                    setBanner(bannerData);
                } else {
                    setBanner(null);
                }
            } else {
                console.error('Error cargando banner:', bannerResult.reason);
                setBanner(null);
            }

        } catch (err) {
            console.error('Error en loadAllUserData:', err);
            setError(err.message || 'Error al cargar datos del usuario');
        } finally {
            setLoading(false);
        }
    }, [userData]);

    /**
     * Refresca los eventos
     */
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
            console.error('Error refrescando eventos:', err);
        }
    }, []);

    /**
     * Refresca los beneficios
     */
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
            console.error('Error refrescando beneficios:', err);
        }
    }, []);

    /**
     * Refresca el banner
     */
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
            console.error('Error refrescando banner:', err);
        }
    }, []);

    /**
     * Refresca todos los datos
     */
    const refreshAllData = useCallback(async () => {
        await loadAllUserData();
    }, [loadAllUserData]);

    // Carga inicial de datos cuando el usuario se autentica
    useEffect(() => {
        if (userData) {
            loadAllUserData();
        }
    }, [userData, loadAllUserData]);

    const value = {
        // Datos del usuario del AuthContext
        userData,
        
        // Datos cargados
        events,
        benefits,
        banner,
        loading,
        error,

        // Funciones de refresco
        refreshEvents,
        refreshBenefits,
        refreshBanner,
        refreshAllData,

        // Setters directos (para actualizaciones optimistas)
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

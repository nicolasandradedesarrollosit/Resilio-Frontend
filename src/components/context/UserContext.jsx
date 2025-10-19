import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContextOauth';
import { getEvents } from '../../helpers/eventsFunctions';
import { getBenefits } from '../../helpers/benefitFunctions';

export const UserContext = createContext();

/**
 * Provider del contexto de usuario común
 * Precarga y mantiene en caché los datos necesarios para usuarios normales
 */
export default function UserProvider({ children }) {
    const { userData } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [benefits, setBenefits] = useState([]);
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
            // Cargar eventos y beneficios en paralelo
            const [eventsResult, benefitsResult] = await Promise.allSettled([
                getEvents(),
                getBenefits()
            ]);

            // Procesar eventos
            if (eventsResult.status === 'fulfilled') {
                const eventsData = eventsResult.value;
                setEvents(eventsData.ok && eventsData.data ? eventsData.data : []);
            } else {
                console.error('Error cargando eventos:', eventsResult.reason);
                setEvents([]);
            }

            // Procesar beneficios
            if (benefitsResult.status === 'fulfilled') {
                const benefitsData = benefitsResult.value;
                setBenefits(benefitsData.ok && benefitsData.data ? benefitsData.data : []);
            } else {
                console.error('Error cargando beneficios:', benefitsResult.reason);
                setBenefits([]);
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
            setEvents(eventsData.ok && eventsData.data ? eventsData.data : []);
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
            setBenefits(benefitsData.ok && benefitsData.data ? benefitsData.data : []);
        } catch (err) {
            console.error('Error refrescando beneficios:', err);
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
        loading,
        error,

        // Funciones de refresco
        refreshEvents,
        refreshBenefits,
        refreshAllData,

        // Setters directos (para actualizaciones optimistas)
        setEvents,
        setBenefits
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

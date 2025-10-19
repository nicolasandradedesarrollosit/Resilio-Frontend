import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getAdminData } from '../../helpers/adminData';
import { getAllUsers } from '../../helpers/adminUserFunctions';
import { getEvents } from '../../helpers/eventsFunctions';
import { getBusiness } from '../../helpers/businessFunctions';
import { getBenefits } from '../../helpers/benefitFunctions';
import { handleAuthError } from '../../helpers/authHelpers';

export const AdminContext = createContext();

/**
 * Provider del contexto de administrador
 * Precarga y mantiene en caché todos los datos necesarios para el panel admin
 */
export default function AdminProvider({ children }) {
    const [adminData, setAdminData] = useState(null);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [business, setBusiness] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Carga todos los datos necesarios para el panel de administrador
     */
    const loadAllAdminData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Cargar todos los datos en paralelo para máxima velocidad
            const [adminInfo, usersData, eventsData, businessData, benefitsData] = await Promise.allSettled([
                getAdminData(),
                getAllUsers(),
                getEvents(),
                getBusiness(),
                getBenefits()
            ]);

            // Procesar datos del administrador
            if (adminInfo.status === 'fulfilled') {
                setAdminData(adminInfo.value);
            } else {
                console.error('Error cargando datos del admin:', adminInfo.reason);
                throw new Error('Error al cargar datos del administrador');
            }

            // Procesar usuarios
            if (usersData.status === 'fulfilled') {
                setUsers(usersData.value);
            } else {
                handleAuthError(usersData.reason, 'Cargando usuarios');
                setUsers([]);
            }

            // Procesar eventos
            if (eventsData.status === 'fulfilled') {
                setEvents(eventsData.value);
            } else {
                handleAuthError(eventsData.reason, 'Cargando eventos');
                setEvents([]);
            }

            // Procesar negocios
            if (businessData.status === 'fulfilled') {
                setBusiness(businessData.value);
            } else {
                handleAuthError(businessData.reason, 'Cargando negocios');
                setBusiness([]);
            }

            // Procesar beneficios
            if (benefitsData.status === 'fulfilled') {
                setBenefits(benefitsData.value);
            } else {
                handleAuthError(benefitsData.reason, 'Cargando beneficios');
                setBenefits([]);
            }

        } catch (err) {
            handleAuthError(err, 'loadAllAdminData');
            setError(err.message || 'Error al cargar datos del panel de administración');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refresca los datos de usuarios
     */
    const refreshUsers = useCallback(async () => {
        try {
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (err) {
            handleAuthError(err, 'refreshUsers');
        }
    }, []);

    /**
     * Refresca los datos de eventos
     */
    const refreshEvents = useCallback(async () => {
        try {
            const eventsData = await getEvents();
            setEvents(eventsData);
        } catch (err) {
            handleAuthError(err, 'refreshEvents');
        }
    }, []);

    /**
     * Refresca los datos de negocios
     */
    const refreshBusiness = useCallback(async () => {
        try {
            const businessData = await getBusiness();
            setBusiness(businessData);
        } catch (err) {
            handleAuthError(err, 'refreshBusiness');
        }
    }, []);

    /**
     * Refresca los datos de beneficios
     */
    const refreshBenefits = useCallback(async () => {
        try {
            const benefitsData = await getBenefits();
            setBenefits(benefitsData);
        } catch (err) {
            handleAuthError(err, 'refreshBenefits');
        }
    }, []);

    /**
     * Refresca todos los datos
     */
    const refreshAllData = useCallback(async () => {
        await loadAllAdminData();
    }, [loadAllAdminData]);

    // Carga inicial de datos
    useEffect(() => {
        loadAllAdminData();
    }, [loadAllAdminData]);

    const value = {
        // Datos
        adminData,
        users,
        events,
        business,
        benefits,
        loading,
        error,

        // Funciones de refresco
        refreshUsers,
        refreshEvents,
        refreshBusiness,
        refreshBenefits,
        refreshAllData,

        // Setters directos (para actualizaciones optimistas)
        setUsers,
        setEvents,
        setBusiness,
        setBenefits
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

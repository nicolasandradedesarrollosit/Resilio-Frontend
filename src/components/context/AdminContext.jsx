import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getAdminData } from '../../helpers/adminData';
import { getAllUsers } from '../../helpers/adminUserFunctions';
import { getEvents } from '../../helpers/eventsFunctions';
import { getBusiness } from '../../helpers/businessFunctions';
import { getBenefits } from '../../helpers/benefitFunctions';
import { handleAuthError } from '../../helpers/authHelpers';

export const AdminContext = createContext();


export default function AdminProvider({ children }) {
    const [adminData, setAdminData] = useState(null);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [business, setBusiness] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const loadAllAdminData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [adminInfo, usersData, eventsData, businessData, benefitsData] = await Promise.allSettled([
                getAdminData(),
                getAllUsers(),
                getEvents(),
                getBusiness(),
                getBenefits()
            ]);

            if (adminInfo.status === 'fulfilled') {
                setAdminData(adminInfo.value);
            } else {
                throw new Error('Error al cargar datos del administrador');
            }

            if (usersData.status === 'fulfilled') {
                setUsers(usersData.value);
            } else {
                handleAuthError(usersData.reason, 'Cargando usuarios');
                setUsers([]);
            }

            if (eventsData.status === 'fulfilled') {
                setEvents(eventsData.value);
            } else {
                handleAuthError(eventsData.reason, 'Cargando eventos');
                setEvents([]);
            }

            if (businessData.status === 'fulfilled') {
                setBusiness(businessData.value);
            } else {
                handleAuthError(businessData.reason, 'Cargando negocios');
                setBusiness([]);
            }

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

    
    const refreshUsers = useCallback(async () => {
        try {
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (err) {
            handleAuthError(err, 'refreshUsers');
        }
    }, []);

    
    const refreshEvents = useCallback(async () => {
        try {
            const eventsData = await getEvents();
            setEvents(eventsData);
        } catch (err) {
            handleAuthError(err, 'refreshEvents');
        }
    }, []);

    
    const refreshBusiness = useCallback(async () => {
        try {
            const businessData = await getBusiness();
            setBusiness(businessData);
        } catch (err) {
            handleAuthError(err, 'refreshBusiness');
        }
    }, []);

    
    const refreshBenefits = useCallback(async () => {
        try {
            const benefitsData = await getBenefits();
            setBenefits(benefitsData);
        } catch (err) {
            handleAuthError(err, 'refreshBenefits');
        }
    }, []);

    
    const refreshAllData = useCallback(async () => {
        await loadAllAdminData();
    }, [loadAllAdminData]);

    useEffect(() => {
        loadAllAdminData();
    }, [loadAllAdminData]);

    const value = {
        adminData,
        users,
        events,
        business,
        benefits,
        loading,
        error,

        refreshUsers,
        refreshEvents,
        refreshBusiness,
        refreshBenefits,
        refreshAllData,

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

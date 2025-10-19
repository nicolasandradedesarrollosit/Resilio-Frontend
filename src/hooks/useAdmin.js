/**
 * Hook personalizado para acceder al contexto de administrador
 */

import { useContext } from 'react';
import { AdminContext } from '../components/context/AdminContext';

export function useAdmin() {
    const context = useContext(AdminContext);
    
    if (!context) {
        throw new Error('useAdmin debe usarse dentro de un AdminProvider');
    }
    
    return context;
}

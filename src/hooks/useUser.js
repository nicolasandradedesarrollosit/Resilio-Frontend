/**
 * Hook personalizado para acceder al contexto de usuario
 */

import { useContext } from 'react';
import { UserContext } from '../components/context/UserContext';

export function useUser() {
    const context = useContext(UserContext);
    
    if (!context) {
        throw new Error('useUser debe usarse dentro de un UserProvider');
    }
    
    return context;
}

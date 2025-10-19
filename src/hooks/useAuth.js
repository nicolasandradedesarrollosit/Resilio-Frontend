/**
 * Hook personalizado para acceder al contexto de autenticación
 */

import { useContext } from 'react';
import { AuthContext } from '../components/context/AuthContextOauth';

export function useAuth() {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    
    return context;
}

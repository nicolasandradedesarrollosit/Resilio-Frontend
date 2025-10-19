import React from 'react';
import UserProvider from '../context/UserContext';

/**
 * Wrapper que proporciona el contexto de usuario
 * a todos los componentes hijos (rutas de usuario)
 */
function UserLayout({ children }) {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}

export default UserLayout;

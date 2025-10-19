import React from 'react';
import AdminProvider from '../context/AdminContext';

/**
 * Wrapper que proporciona el contexto de administrador
 * a todos los componentes hijos (rutas de admin)
 */
function AdminLayout({ children }) {
    return (
        <AdminProvider>
            {children}
        </AdminProvider>
    );
}

export default AdminLayout;

import React from 'react';
import AdminProvider from '../context/AdminContext';


function AdminLayout({ children }) {
    return (
        <AdminProvider>
            {children}
        </AdminProvider>
    );
}

export default AdminLayout;

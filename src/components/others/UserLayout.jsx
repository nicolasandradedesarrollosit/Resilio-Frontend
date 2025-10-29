import React from 'react';
import UserProvider from '../context/UserContext';


function UserLayout({ children }) {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}

export default UserLayout;

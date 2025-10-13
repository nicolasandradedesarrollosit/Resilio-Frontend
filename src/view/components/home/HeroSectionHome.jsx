import React, { useEffect, useState } from 'react';
import '../../../styles/home/heroSection.css';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import logo from '../../../../public/logo-resilio-group.png';
import { checkAuthStatus } from '../../../utils/tokenManager';

function HeroSectionHome(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation(); // Detectar cambios de navegación
    
    useEffect(() => {
        const verifyAuth = async () => {
            setIsLoading(true);
            try {
                // Llamar al endpoint para obtener los datos del usuario y su rol
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.ok && result.data) {
                        setIsAuthenticated(true);
                        setUserRole(result.data.role);
                    } else {
                        setIsAuthenticated(false);
                        setUserRole(null);
                    }
                } else {
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                setIsAuthenticated(false);
                setUserRole(null);
            }
            setIsLoading(false);
        };
        verifyAuth();
    }, [location.pathname]); // Re-verificar cuando cambia la ruta
    
    return(
        <>
            <section className='hero-section-home'>
                <navbar className='navbar-hero-section-home'>
                    <div className='first-item-navbar'>
                        <img className='logo-navbar' src={logo} alt='logo' />
                    </div>
                </navbar>
                <div className='content-hero-section'>
                    <span className='title-content-hero-section'>
                        Somos Resilio
                    </span>
                    <span className='subtitle-content-hero-section'>
                        Una comunidad, un grupo de jóvenes  amantes de la creatividad y de las buenas experiencias
                    </span>
                    <div className='container-buttons-content-hero-section'>
                        <Link className='item-button' id='button-1' to={'/contact'}>Contactarse</Link>
                        {!isLoading && isAuthenticated && userRole === 'admin' && (
                            <Link className='item-button' 
                            id='button-2' to={'/main/admin'}
                            >Ir al panel Admin
                            </Link>
                        )}
                        {!isLoading && isAuthenticated && userRole !== 'admin' && (
                            <Link className='item-button' 
                            id='button-2' to={'/main/user'}
                            >Ir a tu cuenta
                            </Link>
                        )}
                        {!isLoading && !isAuthenticated && (
                            <Link className='item-button' 
                            id='button-2' to={'/log-in'}
                            >Inicie Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
export default HeroSectionHome;
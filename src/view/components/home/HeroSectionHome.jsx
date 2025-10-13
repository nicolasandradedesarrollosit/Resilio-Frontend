import React, { useEffect, useState } from 'react';
import '../../../styles/home/heroSection.css';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import logo from '../../../../public/logo-resilio-group.png';
import { checkAuthStatus } from '../../../utils/tokenManager';

function HeroSectionHome(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        // Verificar si el usuario está autenticado usando cookies
        const verifyAuth = async () => {
            const authStatus = await checkAuthStatus();
            setIsAuthenticated(authStatus.isAuthenticated);
        };
        verifyAuth();
    }, []);
    
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
                        {isAuthenticated && (
                            <Link className='item-button' 
                            id='button-2' to={'/main/user'}
                            >Ir a tu cuenta
                            </Link>
                            )
                        }
                        {!isAuthenticated && (
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
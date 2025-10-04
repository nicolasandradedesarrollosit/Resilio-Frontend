import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../../public/logo-resilio-group.png';
import Avatar from '../../components/others/Avatar';
import '../../../styles/main-user/navbarMainUser.css';

function NavbarMainUser() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('No hay token');
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: decodedToken.sub })
        });

        if (!response.ok) throw new Error('Error en el token');

        const result = await response.json();
        
        if (result.ok && result.data) {
          setUserData(result.data);
        }
      } catch (err) {
        console.error('Error en la consulta', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <nav className='navbar-main-user'>Cargando...</nav>;
  }

  if (!userData) {
    return <nav className='navbar-main-user'>Error al cargar datos</nav>;
  }

  return (
    <nav className='navbar-main-user'>
      <Avatar word={userData.name} isPremium={userData.ispremium} />
      
      <img className='logo-main-user-navbar' src={logo} alt="Logo Resilio Group" />
      
      <div className='container-links-main-user'>
        <Link 
          className={`link-navigate-user ${location.pathname === '/main-user' ? 'active' : ''}`}
          to={'/main-user'}
        >
          Inicio
        </Link>
        <Link 
          className={`link-navigate-user ${location.pathname === '/benefits/user' ? 'active' : ''}`}
          to={'/benefits/user'}
        >
          Beneficios
        </Link>
        <Link 
          className={`link-navigate-user ${location.pathname === '/events/user' ? 'active' : ''}`}
          to={'/events/user'}
        >
          Eventos
        </Link>
        <Link 
          className={`link-navigate-user ${location.pathname === '/logout/user' ? 'active' : ''}`}
          to={'/logout/user'}
        >
          Cerrar Sesión
        </Link>
        
      </div>
    </nav>
  );
}

export default NavbarMainUser;
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../../public/logo-resilio-group.png';
import Avatar from '../../components/others/Avatar';
import '../../../styles/main-user/navbar-main-user.css';

function NavbarMainUser() {
  const token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(token);
  const location = useLocation();

  const userData = async () => {
    try{
      const response = await fetch(`${VITE_API_URL}/api/user-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId: decodedToken.sub})
      });

      if(!response.ok) throw new Error('Error en el token');

      return response.data;

    }
    catch(err){
      console.error('Error en la consulta', err);
    }
  }

  return (
    <nav className='navbar-main-user'>
      <Avatar word={userData.name} isPremium={userData.isPremium} />
      
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
      </div>
    </nav>
  );
}

export default NavbarMainUser;
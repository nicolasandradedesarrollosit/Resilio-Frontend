import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../../public/logo-resilio-group.png';
import Avatar from '../../components/others/Avatar';
import '../../../styles/main-user/navbar-main-user.css';

function NavbarMainUser() {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const location = useLocation();

  return (
    <nav className='navbar-main-user'>
      <Avatar word={decodedToken.name} isPremium={decodedToken.isPremium} />
      
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
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '/logo-resilio-group.png';
import Avatar from '../others/Avatar';
import '../../styles/main-user/navbarMainUser.css';

function NavbarMainUser({ userData }) {
  const location = useLocation();

  if (!userData) {
    return null;
  }

  return (
    <nav className='navbar-main-user'>
      <Avatar word={userData.name} isPremium={userData.ispremium} />
      
      <img className='logo-main-user-navbar' src={logo} alt="Logo Resilio Group" />
      
      <div className='container-links-main-user'>
        <Link 
          className={`link-navigate-user ${location.pathname === '/main/user' ? 'active' : ''}`}
          to={'/main/user'}
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
          className={`link-navigate-user ${location.pathname === '/my-benefits/user' ? 'active' : ''}`}
          to={'/my-benefits/user'}
        >
          Mis Beneficios
        </Link>
      </div>
    </nav>
  );
}

export default NavbarMainUser;
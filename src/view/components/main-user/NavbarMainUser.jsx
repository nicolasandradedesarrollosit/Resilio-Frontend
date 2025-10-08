import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/oauth/AuthContext';
import logo from '../../../../public/logo-resilio-group.png';
import Avatar from '../../components/others/Avatar';
import '../../../styles/main-user/navbarMainUser.css';

function NavbarMainUser() {
  const { userData, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading || !userData) {
    return <nav className='navbar-main-user'>Cargando...</nav>;
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
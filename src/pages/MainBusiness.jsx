import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AsideMenu from '../components/others/AsideMenu';
import LoadingScreen from '../components/others/LoadingScreen';
import AdminErrorState from '../components/others/AdminErrorState';
import { AuthContext } from '../components/context/AuthContextOauth';
import '../styles/main-admin/mainAdmin.css';


function MainBusiness() {
  const navigate = useNavigate();
  const { userData, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <LoadingScreen 
        message="Cargando panel de negocio" 
        subtitle="Preparando tu espacio de trabajo..."
      />
    );
  }

  if (!userData || userData.role !== 'business') {
    return (
      <AdminErrorState
        error={'No tienes permisos para acceder a esta página'}
        onGoToLogin={() => navigate('/log-in', { replace: true })}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div className='container-admin-page'>
        <AsideMenu userData={userData} activeItem={'dashboard'} />
        <main className='main-admin-page'>
          <div style={{ padding: '2rem' }}>
            <h1>Bienvenido, {userData.name}</h1>
            <p>Panel de control para negocios</p>
            <div style={{ marginTop: '2rem' }}>
              <h2>Información del Negocio</h2>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Ubicación:</strong> {userData.location}</p>
              {userData.business_description && (
                <p><strong>Descripción:</strong> {userData.business_description}</p>
              )}
              {userData.phone_number && (
                <p><strong>Teléfono:</strong> {userData.phone_number}</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default MainBusiness;

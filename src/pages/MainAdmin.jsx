import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AsideMenu from '../components/others/AsideMenu';
import ContentMain from '../components/main-admin/ContentAdmin';
import LoadingScreen from '../components/others/LoadingScreen';
import AdminErrorState from '../components/others/AdminErrorState';
import { AdminContext } from '../components/context/AdminContext';
import '../styles/main-admin/mainAdmin.css';


function MainAdmin() {
  const navigate = useNavigate();
  const { adminData, loading, error } = useContext(AdminContext);

  if (loading) {
    return (
      <LoadingScreen 
        message="Cargando panel de administración" 
        subtitle="Preparando herramientas y estadísticas..."
      />
    );
  }

  if (error || !adminData) {
    return (
      <AdminErrorState
        error={error || 'Error al cargar los datos'}
        onGoToLogin={() => navigate('/log-in', { replace: true })}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div className='container-admin-page'>
        <AsideMenu userData={adminData} activeItem={'dashboard'} />
        <main className='main-admin-page'>
          <ContentMain />
        </main>
      </div>
    </>
  );
}

export default MainAdmin;
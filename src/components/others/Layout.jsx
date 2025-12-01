import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../../pages/Home.jsx';
import Contact from '../../pages/Contact.jsx';
import Terms from '../../pages/Terms.jsx';
import Privacity from '../../pages/Privacity.jsx';
import LogIn from '../../pages/LogIn.jsx';
import Register from '../../pages/Register.jsx';
import ForgotPassword from '../../pages/ForgotPassword.jsx';
import MainUser from '../../pages/MainUser.jsx';
import NotFound from './NotFound.jsx';
import Profile from '../../pages/Profile.jsx';
import AuthCallback from '../callback/AuthCallback.jsx';
import MainAdmin from '../../pages/MainAdmin.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicOnlyRoute from './PublicOnlyRoute.jsx';
import AdminEvents from '../../pages/AdminEvents.jsx';
import AdminBenefits from '../../pages/AdminBenefits.jsx';
import AdminLayout from './AdminLayout.jsx';
import UserLayout from './UserLayout.jsx';
import UserBenefits from '../../pages/UserBenefits.jsx';
import UserMyBenefits from '../../pages/UserMyBenefits.jsx';
import MapBenefitsPage from '../../pages/MapBenefitsPage.jsx';
import PartnerUploadPage from '../../pages/PartnerUploadPage.jsx';

function Layout(){
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/service' element={<Terms />} />
        <Route path='/privacity' element={<Privacity />} />
        
        <Route 
          path='/log-in' 
          element={
            <PublicOnlyRoute>
              <LogIn />
            </PublicOnlyRoute>
          } 
        />
        
        <Route 
          path='/register' 
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } 
        />
        
        <Route 
          path='/reset-password' 
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          } 
        />
        
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route 
          path='/main/user' 
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout>
                <MainUser />
              </UserLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path='/profile/user' 
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout>
                <Profile />
              </UserLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/benefits/user' 
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout>
                <UserBenefits />
              </UserLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/my-benefits/user' 
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout>
                <UserMyBenefits />
              </UserLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/user/map/benefits' 
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout>
                <MapBenefitsPage />
              </UserLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/main/admin' 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <MainAdmin />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/events/admin' 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminEvents />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/benefits/admin' 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminBenefits />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        {/* Rutas públicas para partners y negocios (sin autenticación) */}
        <Route path='/partner/upload/:token' element={<PartnerUploadPage />} />
        <Route path='/business/upload/:token' element={<PartnerUploadPage />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Layout;
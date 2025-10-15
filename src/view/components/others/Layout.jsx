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
import AuthCallback from '../../../context/oauth/AuthCallback.jsx';
import MainAdmin from '../../pages/MainAdmin.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

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
        <Route path='/log-in' element={<LogIn />} />
        <Route path='/register' element={<Register />} />
        <Route path='/reset-password' element={<ForgotPassword />} />
        
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route 
          path='/main/user' 
          element={
            <ProtectedRoute requiredRole="user">
              <MainUser />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path='/profile/user' 
          element={
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path='/main/admin' 
          element={
            <ProtectedRoute requiredRole="admin">
              <MainAdmin />
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/events/admin' 
          element={
            <ProtectedRoute requiredRole="admin">
              <MainAdmin />
            </ProtectedRoute>
          } 
        />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Layout;
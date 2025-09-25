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
        <Route path='/main/user' element={<MainUser />} />
      </Routes>
    </>
  );
}

export default Layout;
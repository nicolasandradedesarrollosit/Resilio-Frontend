import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../../pages/Home.jsx';
import Contact from '../../pages/Contact.jsx';
import Terms from '../../pages/Terms.jsx';
import Privacity from '../../pages/Privacity.jsx';

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
      </Routes>
    </>
  );
}

export default Layout;
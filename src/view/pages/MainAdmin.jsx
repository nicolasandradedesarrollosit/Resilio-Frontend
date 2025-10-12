import React from 'react';
import '../../styles/main-admin/main-admin.css';
import AsideMenu from '../components/others/AsideMenu';
import ContentMain from '../components/main-admin/ContentAdmin';


function MainAdmin() {

  return (
  <>
    <div className='container-admin-page'>
      <AsideMenu />
      <main className='main-admin-page'>
        <ContentMain />
      </main>
    </div>
  </>
  )
}

export default MainAdmin;
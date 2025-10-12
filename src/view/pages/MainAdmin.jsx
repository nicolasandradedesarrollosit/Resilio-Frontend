import React from 'react';
import AsideMenu from '../components/others/AsideMenu';
import ContentMain from '../components/main-admin/ContentAdmin';
import '../../styles/main-admin/mainAdmin.css'


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
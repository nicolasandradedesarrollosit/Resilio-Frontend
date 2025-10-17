import React from 'react';
import AsideMenu from '../components/others/AsideMenu';
import '../../styles/main-admin/mainAdmin.css';

function AdminBenefits() {
    return (
        <>
            <div className='container-admin-page'>
              <AsideMenu userData={userData} activeItem={'benefits'} />
              <main className='main-admin-page'>

              </main>
            </div>
        </>
    )
}

export default AdminBenefits;
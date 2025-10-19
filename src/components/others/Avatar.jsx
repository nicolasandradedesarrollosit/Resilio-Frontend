import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/others/avatar.css';

function Avatar({ word, isPremium }) {
  return (
    <div className='avatar-container'>
      <div className='avatar'>
        <div className='containerWord'>
          <span className='wordName'>{word.split("")[0]}</span>
        </div>
        
        <div className='avatar-content'>
          <div className='containerName'>
            <span className='nameAvatar'>{word.split(" ")[0] + " " + word.split(" ")[1]}</span>
            <Link className='profileLink' to={'/profile/user'}>Ver perfil</Link>
          </div>
          
          {!isPremium && (
            <div className='containerPremium'>
              <Link className='premium-link' to='/plans/user'>¿Quieres hacerte premium?</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Avatar;
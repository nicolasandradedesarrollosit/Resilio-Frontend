import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/others/goBack.css';

function GoBack({ dominio }) {
  return (
    <div className='goBack'>
      <Link className='goBackSVG' to={dominio}>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" />
        </svg>
        Volver
      </Link>
    </div>
  );
}

export default GoBack;
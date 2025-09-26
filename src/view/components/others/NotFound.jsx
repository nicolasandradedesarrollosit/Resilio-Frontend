import React from "react";
import {Link} from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      padding: '2rem'
    }}>
      
      <div style={{
        textAlign: 'center',
        maxWidth: '480px'
      }}>
        <h1 style={{
          fontSize: '7rem',
          fontWeight: '700',
          margin: '0 0 1rem 0',
          color: '#000000',
          letterSpacing: '-0.05em'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '500',
          margin: '0 0 0.5rem 0',
          color: '#1a1a1a'
        }}>
          Página no encontrada
        </h2>
        
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          margin: '0 0 2rem 0',
          lineHeight: '1.5'
        }}>
          Perdon, no pudimos encontrar la página que buscabas.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          
          <Link 
            to={'/'}
            style={{
              padding: '12px 20px',
              backgroundColor: '#000000',
              border: '1px solid #000000',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              borderRadius: '6px',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1f2937';
              e.target.style.borderColor = '#1f2937';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#000000';
              e.target.style.borderColor = '#000000';
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
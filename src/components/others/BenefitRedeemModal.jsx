import React from 'react';
import '../../styles/others/benefitRedeemModal.css';

const BenefitRedeemModal = ({ 
  isOpen, 
  onClose, 
  benefitName, 
  businessName, 
  code,
  discount 
}) => {
  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    // Pequeño feedback visual
    const btn = document.querySelector('.btn-copy-code');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ Copiado';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }
  };

  return (
    <div className='benefit-redeem-modal-overlay' onClick={onClose}>
      <div className='benefit-redeem-modal-content' onClick={(e) => e.stopPropagation()}>
        {/* Icono de éxito animado */}
        <div className='success-icon-wrapper'>
          <div className='success-icon-circle'>
            <svg 
              className='success-icon-checkmark' 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 52 52"
            >
              <circle 
                className='success-icon-circle-path' 
                cx="26" 
                cy="26" 
                r="25" 
                fill="none"
              />
              <path 
                className='success-icon-check-path' 
                fill="none" 
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
        </div>

        {/* Contenido */}
        <h2 className='modal-title'>¡Beneficio Canjeado!</h2>
        <p className='modal-subtitle'>Tu descuento está listo para usar</p>

        {/* Información del beneficio */}
        <div className='benefit-info-box'>
          <div className='benefit-info-item'>
            <span className='benefit-info-label'>Beneficio:</span>
            <span className='benefit-info-value'>{benefitName}</span>
          </div>
          <div className='benefit-info-item'>
            <span className='benefit-info-label'>Negocio:</span>
            <span className='benefit-info-value'>{businessName}</span>
          </div>
          {discount && (
            <div className='benefit-info-item'>
              <span className='benefit-info-label'>Descuento:</span>
              <span className='benefit-info-value discount-badge'>{discount}% OFF</span>
            </div>
          )}
        </div>

        {/* Código de canje */}
        <div className='code-section'>
          <label className='code-label'>Tu código de descuento:</label>
          <div className='code-display-box'>
            <span className='code-text'>{code}</span>
            <button 
              className='btn-copy-code' 
              onClick={handleCopyCode}
              title='Copiar código'
            >
              📋 Copiar
            </button>
          </div>
        </div>

        {/* Instrucciones */}
        <div className='instructions-box'>
          <p className='instruction-text'>
            <strong>Cómo usar tu código:</strong>
          </p>
          <ol className='instruction-list'>
            <li>Visita <strong>{businessName}</strong></li>
            <li>Muestra este código al momento de pagar</li>
            <li>¡Disfruta tu descuento!</li>
          </ol>
        </div>

        {/* Nota adicional */}
        <p className='additional-note'>
          💡 Puedes encontrar este código en cualquier momento en <strong>"Mis Beneficios"</strong>
        </p>

        {/* Botón de cerrar */}
        <button className='btn-close-modal-redeem' onClick={onClose}>
          Entendido
        </button>

        {/* Botón X para cerrar */}
        <button className='btn-close-x' onClick={onClose} aria-label='Cerrar'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BenefitRedeemModal;

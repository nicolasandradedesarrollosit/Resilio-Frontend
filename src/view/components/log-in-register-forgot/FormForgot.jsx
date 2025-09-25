import {React, useState} from 'react';
import {Link} from 'react-router-dom';
import '../../../styles/log-in-register-forgot/formLogRegForg.css';

function ForgotPasswordForm() {
    const [isValid, setIsValid] = useState(null);
    const [requestErrorState, setRequestErrorState] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const cartels = [
        'El email debe tener un formato válido example@provider.com', 
        'El email tiene un formato válido'
    ];
    


    function validateField(e) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const content = e.target.value;
        const valid = validate(content, regex);
        setRequestErrorState('');
        if(!valid){
            setIsValid(false);
            return;
        } 
        setIsValid(true);
        return;
    }

    function validate(content, regex) {
        if(!content) return false;
        return regex.test(content);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if(!isValid) return;
        setIsLoading(true);
        setRequestErrorState('');
        setIsValid(null);
        const form = e.target;
        const {email} = form;
        const emailValue = email.value.trim().toLowerCase();

        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:4000/api/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: emailValue })
                });

                const resp = await response.json();

                if(!response.ok){
                    const message = resp.message;
                    setRequestErrorState(message);
                    setIsLoading(false);
                    form.reset();
                    return;
                }

                setIsLoading(false);
                form.reset();
                setSuccess(true);
            
            }
            catch(err){
                setRequestErrorState('Error del servidor, intente nuevamente más tarde.');
                setIsLoading(false);
                form.reset();
            }
        }, 3000);
    }

    return (
        <>
            {success && (
                <div className='success-message-log-in-reg-forg'>
                    <div className="success-icon">✓</div>
    
                    <h2 className="success-title">¡Email Enviado!</h2>
                    
                    <p className="success-message">
                        Se ha enviado un email con las instrucciones para restablecer tu contraseña. 
                        Revisa tu bandeja de entrada y sigue los pasos indicados.
                    </p>
                    
                    <button className='close-btn-success-message-log-in-reg-forg' onClick={() => setSuccess(false)}>x</button>
                    
                    <div className="buttons-container">
                        <Link to={'/log-in'} className='link-success-message'>Volver a iniciar sesión</Link>
                        
                        <button className='secondary-btn' onClick={() => setSuccess(false)}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {success === false && (
                <div className='container-form-log-in-reg-forg'>
                    <form id="form-log-in-reg-forg" className="form-log-in-reg-forg" onSubmit={handleSubmit}>
                        <h2 className='form-title-log-in-reg-forg'>Cambio de contraseña</h2>
                        <div className="field-form-log-in-reg-forg">
                            <input
                            id="email"
                            name="email" 
                            type="text"
                            placeholder=" "
                            onChange={validateField}
                            />
                            <label htmlFor="email">Email</label>
                            
                            {isValid === false && (
                                <span className="cartel-validator-error-log-in-reg-forg">
                                    {cartels[0]}
                                </span>
                            )}
                            {requestErrorState && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {requestErrorState}
                            </span>
                            )}
                            {isValid === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[1]}
                            </span>
                            )}
                        </div>
                        
                        <div className='link-container-log-in-reg-forg'>
                            <Link to={'/log-in'} className='link-log-in-reg-forg'>¿Recordaste tu contraseña?</Link>
                            <Link to={'/register'} className='link-log-in-reg-forg'>¿No tienes una cuenta?</Link>
                        </div>

                        <div className="submit-container-log-in-reg-forg">
                            <button 
                            type="submit" 
                            className="submit-btn-log-in-reg-forg"
                            disabled={isLoading}>
                                {isLoading ? 'Buscando email...' : 'Enviar Email'}
                            </button>
                        </div>

                        <div className={`loading-bar-container ${isLoading ? 'active' : ''}`}>
                            <div className="loading-bar">
                                <div className="loading-bar-fill"></div>
                            </div>
                            <div className="loading-text">
                                Enviando email...
                            </div>
                        </div>
                    </form>
                </div>

            )}
        </>
    );
}

export default ForgotPasswordForm;
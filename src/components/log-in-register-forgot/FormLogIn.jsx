import React, { useState, useContext } from 'react';
import '../../styles/log-in-register-forgot/formLogRegForg.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextOauth';
import LoadingScreen from '../others/LoadingScreen';

function FormLogIn() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const authContext = useContext(AuthContext);
    
    
    const { loginWithGoogle, refreshUserData } = authContext;

    const [validationStates, setValidationStates] = useState({
        email: null,
        password: null
    });
    const [requestErrorState, setRequestErrorState] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showLoadingScreen, setShowLoadingScreen] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const validations = [
        {
            id: 'email',
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        {
            id: 'password',
            regex: /^.{8,72}$/
        }
    ];

    const cartels = [
        {
            error: 'El email debe tener un formato válido example@provider.com',
            success: 'El email tiene un formato válido',
        },
        {
            error: 'La contraseña debe tener entre 8 y 72 caracteres',
            success: 'La contraseña tiene un formato válido',
        }
    ];

    const handleGoogleLogin = async () => {
        
        try {
            setRequestErrorState('');
            setIsGoogleLoading(true);
            const result = await loginWithGoogle();
            
        } catch (error) {
            setRequestErrorState(`Error al conectar con Google: ${error.message}`);
            setIsGoogleLoading(false);
        }
    };

    const validateField = (e) => {
        setRequestErrorState('');
        const id = e.target.id;
        const content = e.target.value;
        let sanitizedContent;

        validations.forEach((item) => {
            if(item.id === id){
                id === 'email' ? sanitizedContent = content.toLowerCase().trim() : sanitizedContent = content;
                const isValid = validate(sanitizedContent, item.regex);
                setValidationStates(prevState => ({
                    ...prevState,
                    [id]: isValid
                }));
            }
        });
    }
    
    const validate = (content, regex) => {
        if(!content) return false;
        return regex.test(content);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const { email, password } = form;
        const emailValue = email.value.toLowerCase().trim();
        const passwordValue = password.value;

        if(validationStates.email && validationStates.password){
            setIsLoading(true);
            setRequestErrorState('');
            setValidationStates({
                email: null,
                password: null
            });

            (async () => {
                try {
                    const response = await fetch(`${API_URL}/api/log-in`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: emailValue, password: passwordValue }),
                    });

                    const resp = await response.json();
                    
                    if(!response.ok){
                        // Si falla el login normal, intentar login de negocio
                        const businessResponse = await fetch(`${API_URL}/api/business-login`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: emailValue, password: passwordValue }),
                        });

                        const businessResp = await businessResponse.json();
                        
                        if(!businessResponse.ok){
                            console.log('❌ Business login falló:', businessResp);
                            setRequestErrorState(businessResp.message || resp.message);
                            setIsLoading(false);
                            form.reset();
                            return;
                        }

                        console.log('✅ Business login exitoso, obteniendo datos...');
                        
                        // Login de negocio exitoso - cargar datos directamente
                        const businessData = await fetch(`${API_URL}/api/business-data`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' }
                        });

                        console.log('📊 Response de business-data:', businessData.status);

                        if (!businessData.ok) {
                            const errorData = await businessData.json();
                            console.log('❌ Error business-data:', errorData);
                            throw new Error(errorData.message || 'Error al obtener datos del negocio');
                        }

                        const businessResult = await businessData.json();
                        
                        // El contexto se actualizará automáticamente al navegar
                        
                        setIsLoading(false);
                        form.reset();
                        setLoadingMessage('Accediendo al panel de negocio...');
                        setShowLoadingScreen(true);
                        setTimeout(() => {
                            navigate("/main/business", { state: { fromApp: true } });
                        }, 1500);
                        return;
                    }

                    // Login de usuario normal exitoso
                    const userData = await refreshUserData();

                    if (!userData) {
                        throw new Error('Error al obtener datos del usuario');
                    }

                    const userRole = userData.role || 'user';

                    setIsLoading(false);
                    form.reset();

                    if (userRole === 'admin') {
                        setLoadingMessage('Accediendo al panel de administración...');
                        setShowLoadingScreen(true);
                        setTimeout(() => {
                            navigate("/main/admin", { state: { fromApp: true } });
                        }, 1500);
                    } else if (userRole === 'business') {
                        setLoadingMessage('Accediendo al panel de negocio...');
                        setShowLoadingScreen(true);
                        setTimeout(() => {
                            navigate("/main/business", { state: { fromApp: true } });
                        }, 1500);
                    } else {
                        setLoadingMessage('Cargando tu espacio personal...');
                        setShowLoadingScreen(true);
                        setTimeout(() => {
                            navigate("/main/user", { state: { fromApp: true } });
                        }, 1500);
                    }
                } 
                catch (err) {
                    setRequestErrorState('Error del servidor, intente nuevamente más tarde.');
                    setIsLoading(false);
                    form.reset();
                }
            })();
        }
        else {
            setRequestErrorState('Por favor, complete el formulario correctamente antes de enviar.');
        }
    }

    return (
        <>
            {showLoadingScreen && (
                <LoadingScreen 
                    message={loadingMessage} 
                    subtitle="Preparando tu experiencia"
                />
            )}
            
            <div className='container-form-log-in-reg-forg'>
                <form id="form-log-in-reg-forg" className="form-log-in-reg-forg" onSubmit={handleSubmit}>
                    <h2 className='form-title-log-in-reg-forg'>Inicio de Sesión</h2>
                    
                    <div className="field-form-log-in-reg-forg">
                        <input
                            id="email"
                            name="email" 
                            type="text"
                            placeholder=" "
                            onChange={validateField}
                            disabled={isLoading || isGoogleLoading}
                        />
                        <label htmlFor="email">Email</label>
                        
                        {validationStates.email === false && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {cartels[0].error}
                            </span>
                        )}
                        {validationStates.email === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[0].success}
                            </span>
                        )}
                    </div>
                    
                    <div className="field-form-log-in-reg-forg">
                        <input
                            id="password"
                            name="password"
                            type="password" 
                            placeholder=" "
                            onChange={validateField}
                            disabled={isLoading || isGoogleLoading}
                        />
                        <label htmlFor="password">Contraseña</label>
                    
                        {validationStates.password === false && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {cartels[1].error}
                            </span>
                        )}
                        {validationStates.password === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[1].success}
                            </span>
                        )}
                    </div>

                    <div className="submit-container-log-in-reg-forg">
                        <button 
                            type="submit" 
                            className="submit-btn-log-in-reg-forg"
                            disabled={isLoading || isGoogleLoading}
                        >
                            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>

                    <div className="auth-separator">
                        <div className="auth-separator-line"></div>
                        <span className="auth-separator-text">o</span>
                        <div className="auth-separator-line"></div>
                    </div>
                    
                    <div className="google-login-container">
                        <button 
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || isLoading}
                            className="google-login-btn"
                            style={{ 
                                opacity: (isGoogleLoading || isLoading) ? 0.6 : 1,
                                cursor: (isGoogleLoading || isLoading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isGoogleLoading ? (
                                <>
                                    <div style={{
                                        display: 'inline-block',
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid #f3f3f3',
                                        borderTop: '2px solid #4285f4',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                        marginRight: '8px'
                                    }}></div>
                                    Conectando con Google...
                                </>
                            ) : (
                                <>
                                    <svg className="google-icon" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Continuar con Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className='link-container-log-in-reg-forg'>
                        <Link to={'/reset-password'} className='link-log-in-reg-forg'>¿Olvidaste tu contraseña?</Link>
                        <Link to={'/register'} className='link-log-in-reg-forg'>Registrarse</Link>
                    </div>

                    {requestErrorState && (
                        <span id="request-error" className="cartel-validator-error-log-in-reg-forg">
                            {requestErrorState}
                        </span>
                    )}
                </form>

                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
}

export default FormLogIn;
import React, { useState, useEffect } from 'react';
import '../../../styles/log-in-register-forgot/formLogRegForg.css';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import supabase from '../../../viewmodel/oauth/Supabase';

function FormLogIn() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [validationStates, setValidationStates] = useState({
        email: null,
        password: null
    });
    const [requestErrorState, setRequestErrorState] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [user, setUser] = useState(null);

    ///////////////////
    // Funcion que verifica si la sesion del usuario esta activa con Google
    ///////////////////

    useEffect(() => {
        let mounted = true;

        const handleOAuthRedirect = async () => {
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                const params = new URLSearchParams(hash.replace(/^#/, ''));
                const access_token = params.get('access_token');
                const refresh_token = params.get('refresh_token');

                if (access_token && refresh_token) {
                    const { data, error } = await supabase.auth.setSession({
                        access_token,
                        refresh_token
                    });

                    if (error) {
                        console.error('Error al setear sesión OAuth manualmente:', error);
                        return;
                    }

                    if (mounted && data?.user) {
                        setUser(data.user);
                        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
                        navigate(data.user.role === 'admin' ? '/main/admin' : '/main/user');
                    }
                }
            } else {
                const { data: { session } = {} } = await supabase.auth.getSession();
                if (session?.user && mounted) {
                    setUser(session.user);
                    navigate(session.user.role === 'admin' ? '/main/admin' : '/main/user');
                }
            }
        };

        handleOAuthRedirect();

        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
                navigate(session.user.role === 'admin' ? '/main/admin' : '/main/user');
            } else {
                setUser(null);
            }
            setIsGoogleLoading(false);
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe?.();
        };
    }, []);

    ///////////////////
    // Sign in con Google
    ///////////////////

    const handleGoogleLogIn = async (e) =>{
        try{
            setIsGoogleLoading(true);
            setRequestErrorState('');

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/#/log-in`
                }
            })

            if(error){
                setRequestErrorState('Error inesperado al conectar con Google: ' + error.message);
                setIsGoogleLoading(false);
            }
        }
        catch{
            setRequestErrorState('Error inesperado al conectar con Google');
            setIsGoogleLoading(false)
        }
    }

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

    const validateField = (e) => {
        setRequestErrorState('');
        const id = e.target.id;
        const content = e.target.value;
        let sanitizedContent;

        validations.forEach((item) => {
            if(item.id === id){
                id === 'email' ? sanitizedContent = content.toLowerCase().trim() :  sanitizedContent = content;
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
            })
            setTimeout(async () => {
                try {
                    const response = await fetch(`${API_URL}/api/log-in`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: emailValue, password: passwordValue }),
                    });

                    const resp = await response.json();
                    if(!response.ok){
                        const message = resp.message;
                        setRequestErrorState(message);
                        setIsLoading(false);
                        form.reset();
                        return;
                    }

                    const accessToken = resp.data.accessToken;
                    if(!accessToken){
                        setRequestErrorState('Error del servidor, intente nuevamente más tarde.');
                        setIsLoading(false);
                        form.reset();
                        return;
                    }

                    localStorage.setItem('token', accessToken);
                    const decodedToken = jwtDecode(accessToken);

                    setRequestErrorState('');

                    setIsLoading(false);
                    form.reset();

                    if (decodedToken.role === 'admin') {
                        navigate("/main/admin");
                    } else {
                        navigate("/main/user");
                    }
                } 
                catch (err) {
                        setRequestErrorState('Error del servidor, intente nuevamente más tarde.');
                        setIsLoading(false);
                        form.reset();
                    }
            }, 1500);
        }
        else {
            setRequestErrorState('Por favor, complete el formulario correctamente antes de enviar.');
        }
    }

    if (user) {
        return (
            <div className='container-form-log-in-reg-forg'>
                <div className="form-log-in-reg-forg welcome-message">
                    <h2 className='form-title-log-in-reg-forg'>Bienvenido</h2>
                    <p className="welcome-user-email">Ya estás autenticado como {user.email}</p>
                    <p className="welcome-redirect-text">
                        Redirigiendo<span className="welcome-loading"></span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
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

                    <div className="auth-separator">
                        <div className="auth-separator-line"></div>
                        <span className="auth-separator-text">o</span>
                        <div className="auth-separator-line"></div>
                    </div>
                    
                    <div className="google-login-container">
                        <button 
                            type="button"
                            onClick={handleGoogleLogIn}
                            disabled={isGoogleLoading || isLoading}
                            className="google-login-btn"
                        >
                            {isGoogleLoading ? (
                                'Conectando con Google...'
                            ) : (
                                <>
                                    <svg className="google-icon" viewBox="0 0 24 24">
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

                    <div className="submit-container-log-in-reg-forg">
                        <button 
                        type="submit" 
                        className="submit-btn-log-in-reg-forg"
                        disabled={isLoading || isGoogleLoading}>
                            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>

                    <div className={`loading-bar-container ${(isLoading || isGoogleLoading) ? 'active' : ''}`}>
                        <div className="loading-bar">
                            <div className="loading-bar-fill"></div>
                        </div>
                        <div className="loading-text">
                            {isGoogleLoading ? 'Conectando con Google...' : 'Verificando credenciales...'}
                        </div>
                    </div>
                    {requestErrorState && (
                        <span id="request-error" className="cartel-validator-error-log-in-reg-forg">
                            {requestErrorState}
                        </span>
                    )}
                </form>
            </div>
        </>
    );
}

export default FormLogIn;
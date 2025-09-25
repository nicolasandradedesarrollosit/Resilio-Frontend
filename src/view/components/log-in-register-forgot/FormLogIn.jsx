import { React, useState } from 'react';
import '../../../styles/log-in-register-forgot/formLogRegForg.css';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function FormLogIn() {
    const [validationStates, setValidationStates] = useState({
        email: null,
        password: null
    });
    const [requestErrorState, setRequestErrorState] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
                    const response = await fetch('http://localhost:4000/api/log-in', {
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
            }, 3000);
        }
        else {
            setRequestErrorState('Por favor, complete el formulario correctamente antes de enviar.');
        }
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
                        {requestErrorState && (
                        <span className="cartel-validator-error-log-in-reg-forg">
                            {requestErrorState}
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
                        {requestErrorState && (
                        <span className="cartel-validator-error-log-in-reg-forg">
                            {requestErrorState}
                        </span>
                        )}
                        {validationStates.password === true && (
                        <span className="cartel-validator-success-log-in-reg-forg">
                            {cartels[1].success}
                        </span>
                        )}
                    </div>
                    <div className='link-container-log-in-reg-forg'>
                        <Link to={'/reset-password'} className='link-log-in-reg-forg'>¿Olvidaste tu contraseña?</Link>
                        <Link to={'/register'} className='link-log-in-reg-forg'>Registrarse</Link>
                    </div>

                    <div className="submit-container-log-in-reg-forg">
                        <button 
                        type="submit" 
                        className="submit-btn-log-in-reg-forg"
                        disabled={isLoading}>
                            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>

                    <div className={`loading-bar-container ${isLoading ? 'active' : ''}`}>
                        <div className="loading-bar">
                            <div className="loading-bar-fill"></div>
                        </div>
                        <div className="loading-text">
                            Verificando credenciales...
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default FormLogIn;
import { React, useState } from 'react';
import '../../../styles/log-in-register-forgot/formLogRegForg.css';
import { Link, useNavigate } from 'react-router-dom';

function FormRegister() {
    const [validationStates, setValidationStates] = useState({
        name: null,
        province: null,
        city: null,
        phone_number: null,
        email: null,
        password: null
    });
    const [requestErrorState, setRequestErrorState] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const provinces = [
        "Buenos Aires",
        "Ciudad Autónoma de Buenos Aires",
        "Catamarca",
        "Chaco",
        "Chubut",
        "Córdoba",
        "Corrientes",
        "Entre Ríos",
        "Formosa",
        "Jujuy",
        "La Pampa",
        "La Rioja",
        "Mendoza",
        "Misiones",
        "Neuquén",
        "Río Negro",
        "Salta",
        "San Juan",
        "San Luis",
        "Santa Cruz",
        "Santa Fe",
        "Santiago del Estero",
        "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
        "Tucumán"
    ];

    const validations = [
        {
            id: 'name',
            regex: /^[A-Za-zÀÁÉÍÓÚàáéíóúÑñ\s'-]{1,100}$/
        },
        {
            id: 'province',
            regex: /^[A-Za-zÀÁÉÍÓÚàáéíóúÑñ\s,'-]{1,100}$/
        },
        {
            id: 'city',
            regex: /^[A-Za-zÀÁÉÍÓÚàáéíóúÑñ\s'-]{1,100}$/
        },
        {
            id: 'phone_number',
            regex: /^[0-9]{9,15}$/
        },
        {
            id: 'email',
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        {
            id: 'password',
            regex: /^(?=\S{8,72}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/
        }
    ];

    const cartels = [
        {
            error: 'El nombre solo debe contener letras y espacios, con un máximo de 100 caracteres',
            success: 'El nombre tiene un formato válido' 
        },
        {
            error: 'La provincia solo debe contener letras y espacios, con un máximo de 100 caracteres',
            success: 'La provincia tiene un formato válido'
        },
        {
            error: 'La ciudad solo debe contener letras y espacios, con un máximo de 100 caracteres',
            success: 'La ciudad tiene un formato válido'
        },
        {
            error: 'El número de teléfono debe contener solo números y tener entre 9 y 15 dígitos',
            success: 'El número de teléfono tiene un formato válido'
        },
        {
            error: 'El email debe tener un formato válido example@provider.com',
            success: 'El email tiene un formato válido'
        },
        {
            error: 'La contraseña debe tener entre 8 y 72 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial',
            success: 'La contraseña tiene un formato válido'
        }
    ];

    const validateField = (e) => {
        setRequestErrorState('');
        const id = e.target.id;
        const content = e.target.value;
        let sanitizedContent;

        validations.forEach((item) => {
            if(item.id === id) {
                id === 'email' ? sanitizedContent = content.toLowerCase().trim() : sanitizedContent = content;
                const isValid = validate(sanitizedContent, item.regex);
                setValidationStates(prevState => ({
                    ...prevState,
                    [id]: isValid
                }));
            }
        });
        console.log(Object.values(validationStates).every(Boolean));
    };

    const validate = (content, regex) => {
        if(!content) return false;
        return regex.test(content);
    };

    const handleSubmit = (e) => {
        const API_URL = import.meta.env.VITE_API_URL
        e.preventDefault();
        const form = e.target;
        const { name, province, city, phone_number, email, password } = form;
        const nameValue = name.value.trim();
        const provinceValue = province.value;
        const cityValue = city.value.trim();
        const phoneNumberValue = phone_number.value;
        const emailValue = email.value.toLowerCase().trim();
        const passwordValue = password.value;

        if(Object.values(validationStates).every(Boolean)){
            setIsLoading(true);
            setRequestErrorState('');
            setValidationStates({
                name: null,
                province: null,
                city: null,
                phone_number: null,
                email: null,
                password: null
            })
            setTimeout(async () => {
                try {
                    const response = await fetch(`${API_URL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: nameValue, province: provinceValue, city: cityValue, phone_number: phoneNumberValue, email: emailValue, password: passwordValue }),
                    });

                    const resp = await response.json();
                    if(!response.ok){
                        const message = resp.message;
                        setRequestErrorState(message);
                        setIsLoading(false);
                        form.reset();
                        return;
                    }

                    setRequestErrorState('');

                    setIsLoading(false);
                    form.reset();
                    navigate('/log-in');
                    return;
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
    };

    return (
        <>
            <div className='container-form-log-in-reg-forg'>
                <form id="form-log-in-reg-forg" className="form-log-in-reg-forg" onSubmit={handleSubmit}>
                    <h2 className='form-title-log-in-reg-forg'>Registro</h2>
                    
                    <div className="field-form-log-in-reg-forg">
                        <input
                            id="name"
                            name="name"
                            type="text" 
                            placeholder=" "
                            onChange={validateField}
                        />
                        <label htmlFor="name">Nombre</label>
                    
                        {validationStates.name === false && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {cartels[0].error}
                            </span>
                        )}
                        {requestErrorState && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {requestErrorState}
                            </span>
                        )}
                        {validationStates.name === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[0].success}
                            </span>
                        )}
                    </div>

                    <div className="field-form-log-in-reg-forg">
                        <select
                            id="province"
                            name="province" 
                            placeholder=" "
                            onChange={validateField}
                        >
                            <option value="">Seleccione una provincia</option>
                            {provinces.map((province) => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                                            
                        {validationStates.province === false && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {cartels[1].error}
                            </span>
                        )}
                        {requestErrorState && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {requestErrorState}
                            </span>
                        )}
                        {validationStates.province === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[1].success}
                            </span>
                        )}
                    </div>

                    <div className="field-form-log-in-reg-forg">
                        <input
                            id="city"
                            name="city"
                            type="text" 
                            placeholder=" "
                            onChange={validateField}
                        />
                        <label htmlFor="city">Ciudad</label>
                    
                        {validationStates.city === false && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {cartels[2].error}
                            </span>
                        )}
                        {requestErrorState && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {requestErrorState}
                            </span>
                        )}
                        {validationStates.city === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[2].success}
                            </span>
                        )}
                    </div>

                    <div className="field-form-log-in-reg-forg">
                        <input
                            id="phone_number"
                            name="phone_number"
                            type="text" 
                            placeholder=" "
                            onChange={validateField}
                        />
                        <label htmlFor="phone_number">Número de teléfono</label>
                    
                        {validationStates.phone_number === false && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {cartels[3].error}
                            </span>
                        )}
                        {requestErrorState && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {requestErrorState}
                            </span>
                        )}
                        {validationStates.phone_number === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[3].success}
                            </span>
                        )} 
                    </div>

                    <div className="field-form-log-in-reg-forg">
                        <input
                            id="email"
                            name="email" 
                            type="email"
                            placeholder=" "
                            onChange={validateField}
                        />
                        <label htmlFor="email">Email</label>
                        
                        {validationStates.email === false && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {cartels[4].error}
                            </span>
                        )}
                        {requestErrorState && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {requestErrorState}
                            </span>
                        )}
                        {validationStates.email === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[4].success}
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
                                {cartels[5].error}
                            </span>
                        )}
                        {requestErrorState && (
                            <span className="cartel-validator-error-log-in-reg-forg">
                                {requestErrorState}
                            </span>
                        )}
                        {validationStates.password === true && (
                            <span className="cartel-validator-success-log-in-reg-forg">
                                {cartels[5].success}
                            </span>
                        )}
                    </div>
                    
                    <div className='link-container-log-in-reg-forg'>
                        <Link to={'/log-in'} className='link-log-in-reg-forg'>¿Ya tienes una cuenta?</Link>
                    </div>

                    <div className="submit-container-log-in-reg-forg">
                        <button 
                            type="submit" 
                            className="submit-btn-log-in-reg-forg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="loading-bar-container active">
                            <div className="loading-bar">
                                <div className="loading-bar-fill"></div>
                            </div>
                            <div className="loading-text">
                                Procesando registro...
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}

export default FormRegister;
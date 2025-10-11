import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/oauth/AuthContext";
import "../../styles/profile/profile.css";
import { jwtDecode } from "jwt-decode";
import GoBack from '../components/others/GoBack';
import { useNavigate } from "react-router-dom";

function Profile(){
    const { userData, loading } = useContext(AuthContext);
    const [modal, setModal] = useState(false);
    const [validationStates, setValidationStates] = useState({
        name: null,
        province: null,
        city: null,
        phone_number: null,
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
        }
    ];

    const validateField = (e) => {
        setRequestErrorState('');
        const id = e.target.id;
        const content = e.target.value.trim();

        const validation = validations.find(item => item.id === id);
        
        if (validation) {
            const isValid = validate(content, validation.regex);
            setValidationStates(prevState => ({
                ...prevState,
                [id]: isValid
            }));
        }
    };

    const validate = (content, regex) => {
        if(!content) return false;
        return regex.test(content);
    };

    const refreshUserData = () => {
        setModal(true);
        // Validar los campos actuales como válidos al abrir el modal
        setValidationStates({
            name: true,
            province: true,
            city: true,
            phone_number: true,
        });
        setRequestErrorState('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const { name, province, city, phone_number } = form;
        
        const nameValue = name.value.trim();
        const provinceValue = province.value;
        const cityValue = city.value.trim();
        const phoneNumberValue = phone_number.value;

        // Validar que todos los campos tengan formato válido
        const allFieldsValid = Object.values(validationStates).every(state => state === true);
        
        if(!allFieldsValid) {
            setRequestErrorState('Por favor, complete el formulario correctamente antes de enviar.');
            return;
        }

        setIsLoading(true);
        setRequestErrorState('');

        const updatedFields = {};
        
        if (nameValue !== userData.name) {
            updatedFields.name = nameValue;
        }
        if (provinceValue !== userData.province) {
            updatedFields.province = provinceValue;
        }
        if (cityValue !== userData.city) {
            updatedFields.city = cityValue;
        }
        if (phoneNumberValue !== userData.phone_number) {
            updatedFields.phone_number = phoneNumberValue;
        }

        if (Object.keys(updatedFields).length === 0) {
            setRequestErrorState('No se detectaron cambios en los datos.');
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.sub;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/update-user/${userId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFields)
            });
            
            const resp = await response.json();
            
            if(!response.ok) {
                const message = resp.message || 'Error al actualizar datos';
                setRequestErrorState(message);
                setIsLoading(false);
                return;
            }
            
            setIsLoading(false);
            setModal(false);
            location.reload();
        }
        catch (error) {
            if(import.meta.env.DEV){
                console.error('Error en handleSubmit:', error);
            }
            setRequestErrorState('Error del servidor, intente nuevamente más tarde.');
            setIsLoading(false);
        }
    }

    const logOutSession = () => {
        useEffect(() => {
            const logOut = async () => {
                try{
                    const logOutResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });

                    if(!logOutResponse.ok){
                        throw new Error('Error al cerrar sesión');
                    }
                }
                catch(err){
                    throw new Error(err.message || 'Error al cerrar sesión');
                }
            }
            logOut();
        }, []);

        localStorage.removeItem('access_token');
        navigate('/log-in');
    }

    if (loading || !userData) {
        return (
            <div className="profile-container">
                <p>Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <GoBack dominio={'/main/user'}/>
            <main className='background-profile'>
                <h2 className='title-profile'>Mi cuenta</h2>
                <div className='profile-container'>
                <div className='profile-first-row'>
                    <h2 className='title-section'>Nicolas Andrade</h2>
                    <span className={verified ? 'verified' : 'not-verified'}>{verified ? 'Verificado' : 'No verificado'}</span>
                </div>
                <div className='profile-second-row'>
                    <div className='component-stats'>
                    <svg className='icon-profile' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#FFF" d="M12 1L9 9l-8 3l8 3l3 8l3-8l8-3l-8-3l-3-8Z"/></svg>
                    <div className='stats-text'>
                        <span className='title-stats'>1200</span>
                        <span className='subtitle-stats'>Puntos obtenidos</span>
                    </div>
                    </div>
                    <div className='component-stats'>
                    <svg className='icon-profile' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                        <path fill="#FFF" d="M21 5H3a1 1 0 0 0-1 1v4h.893c.996 0 1.92.681 2.08 1.664A2.001 2.001 0 0 1 3 14H2v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4h-1a2.001 2.001 0 0 1-1.973-2.336c.16-.983 1.084-1.664 2.08-1.664H22V6a1 1 0 0 0-1-1zM11 17H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2z"/>
                    </svg>
                    <div className='stats-text'>
                        <span className='title-stats'>3</span>
                        <span className='subtitle-stats'>Cupones canjeados</span>
                    </div>
                    </div>
                </div>
                </div>
                <div className='personal-info-profile'>
                <h2 className='title-section'>Información personal</h2>
                <div className='personal-info-row'>
                    <span className='info-item'>
                    <svg className='icon-profile' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 42 42"><path fill="#FFF" fill-rule="evenodd" d="M33 13.924C33 6.893 27.594 1 20.51 1S8 6.897 8 13.93C8 16.25 8.324 18 9.423 20h-.021l10.695 20.621c.402.551.824-.032.824-.032C20.56 41.13 31.616 20 31.616 20h-.009C32.695 18 33 16.246 33 13.924zm-18.249-.396c0-3.317 2.579-6.004 5.759-6.004c3.179 0 5.76 2.687 5.76 6.004s-2.581 6.005-5.76 6.005c-3.18 0-5.759-2.687-5.759-6.005z"/></svg>
                    <div>
                        <p className='title-info'>{location}</p>
                        <span className='subtitle-info'>Location</span>
                    </div>
                    </span>
                    <span className='info-item'>
                    <svg className='icon-profile' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16"><path fill="#FFF" d="M12.2 10c-1.1-.1-1.7 1.4-2.5 1.8C8.4 12.5 6 10 6 10S3.5 7.6 4.1 6.3c.5-.8 2-1.4 1.9-2.5c-.1-1-2.3-4.6-3.4-3.6C.2 2.4 0 3.3 0 5.1c-.1 3.1 3.9 7 3.9 7c.4.4 3.9 4 7 3.9c1.8 0 2.7-.2 4.9-2.6c1-1.1-2.5-3.3-3.6-3.4z"/></svg>
                    <div>
                        <p className='title-info'>{phone}</p>
                        <span className='subtitle-info'>Phone</span>
                    </div>
                    </span>
                    <span className='info-item'>
                    <svg className='icon-profile' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 42 42"><path fill="#FFF" d="M40.5 31.5v-18S22.3 26.2 20.53 26.859C18.79 26.23.5 13.5.5 13.5v18c0 2.5.53 3 3 3h34c2.529 0 3-.439 3-3zm-.029-21.529c0-1.821-.531-2.471-2.971-2.471h-34c-2.51 0-3 .78-3 2.6l.03.28s18.069 12.44 20 13.12c2.04-.79 19.97-13.4 19.97-13.4l-.029-.129z"/></svg>
                    <div>
                        <p className='title-info'>{email}</p>
                        <span className='subtitle-info'>Email</span>
                    </div>
                    </span>
                    <span className='info-item'>
                    <svg className='icon-profile' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512"><path fill="#FFF" d="M288.3 13.4c-12.3-.01-23 6.49-27.3 15.31l-2.9 5.95l-6.6-1.01c-5.5-.85-11.3-1.32-17.1-1.32c-18.8 0-35.7 4.5-47.3 11.14c-11.5 6.64-16.9 14.59-16.9 22c0 7.42 5.4 15.37 16.9 22c11.6 6.64 28.5 11.13 47.3 11.13c7.5-.02 14.9-.74 21.8-2.13l6.3-1.23l3.2 5.46c5.6 9.2 23.7 18.2 44.7 18.2c13.9 0 26.4-3.6 34.8-8.8c8.4-5.2 12.2-11.23 12.2-16.9c0-5.09-3-10.48-10-15.44c-6.9-4.97-17.6-8.87-30-9.95l-18.3-1.59l12.5-13.49c4.1-4.41 6.1-9.6 6.1-14.87c0-12.88-12.4-24.46-29.4-24.46zM152.2 65.46C84.8 102.3 39 173.9 39 256c0 32.1 7 62.6 19.54 90c5.95-7.9 10.48-13.4 12.67-16C62.05 307.2 57 282.2 57 256c0-74 40.27-138.5 100.1-172.78c-3.1-5.39-4.9-11.34-4.9-17.74v-.02zm210.7 1.75c7.5 6.93 12.5 15.9 12.5 25.99c0 1.14-.1 2.27-.2 3.38C423.7 132.9 455 190.7 455 256c0 23.7-4.2 46.5-11.8 67.6l18.3 2.2c7.4-21.9 11.5-45.4 11.5-69.8c0-80.8-44.4-151.5-110.1-188.79zm58.6 270.49c-11.1.2-23 1.1-35.9 3.1l-.5.1l-.5.1c-25.8 7.3-37.1 15.2-46.4 24.7l-2.2 2.2l-.3 3.1c-3.4 29.6-5.8 60 0 91.8l1.3 6.8l6.8.6c30.6 2.6 58.7 1.4 86.2 0l1-.1l.9-.2c18.5-5.2 34.4-12.8 46.4-24.6l1.7-1.6l.6-2.2c10-33.4 3.4-63.8.4-92.7l-.8-7.4l-7.3-.7c-16.2-1.5-32.8-3.2-51.4-3zM79.62 348.2c-4.94 6.1-11.43 14.5-18.58 25.6c-12.29 18.9-22.53 42.4-20.51 54.9c1.43 8.8 6.97 19.6 14.51 27.6c7.54 7.9 16.69 12.8 24.58 12.8c7.87 0 17.03-4.9 24.58-12.8c7.5-8 13.1-18.8 14.5-27.6c2-12.5-8.2-36-20.5-54.9c-7.15-11-13.64-19.5-18.58-25.6zM427 355.7c1.7 0 3.3 0 5 .1c5.4.1 10.7.4 16 .8c-5.9 3.4-12.1 6.8-19.5 9.9l-2.4.2c-19.5 1.4-37.7.3-55.4-2c4.7-2 10.5-4 18.3-6.2c13.8-2.2 26.3-2.9 38-2.8zm38 11.6c2.8 22.9 5 44.5-1 66.6c-7 6.3-16 11.4-27 15.4c3-22.5 2-44.8-.5-66.6c11.3-5 20.2-10.2 28.5-15.4zm-112.2 13.1c20.7 3.2 42.3 5.4 65.8 4.5c2.5 23 3.5 45.6-.4 67.8c-21.5 1-43.1 1.5-65.8-.1c-3.5-24-2.2-47.9.4-72.2zm-216.4 34.7c.9 5.5 1 11 .1 16.4c-.3 1.6-.6 3.3-1 4.9C170 459.5 211.4 473 256 473c21.6 0 42.5-3.2 62.3-9.1l-2-18.2c-19 6-39.3 9.3-60.3 9.3c-44.9 0-86.3-14.8-119.6-39.9z"/></svg>
                    <div>
                        <p className='title-info'>{premium ? 'Premium' : 'No Premium'}</p>
                        <span className='subtitle-info'>Estado</span>
                    </div>
                    </span>
                </div>
                <div className='container-buttons'>
                    <button onClick={refreshUserData} className='button-profile' id='edit-profile'>
                        <svg className='icon-button' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 20 20"><path fill="#FFF" d="m2.292 13.36l4.523 4.756L.5 20l1.792-6.64ZM12.705 2.412l4.522 4.755L7.266 17.64l-4.523-4.754l9.962-10.474ZM16.142.348l2.976 3.129c.807.848.086 1.613.086 1.613l-1.521 1.6l-4.524-4.757L14.68.334l.02-.019c.119-.112.776-.668 1.443.033Z"/></svg>
                        Actualizar perfil
                    </button>
                    <button onClick={logOutSession} className='button-profile' id='log-out'>
                        <svg className='icon-button' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512"><path fill="#FFF" d="M160 256a16 16 0 0 1 16-16h144V136c0-32-33.79-56-64-56H104a56.06 56.06 0 0 0-56 56v240a56.06 56.06 0 0 0 56 56h160a56.06 56.06 0 0 0 56-56V272H176a16 16 0 0 1-16-16Zm299.31-11.31l-80-80a16 16 0 0 0-22.62 22.62L409.37 240H320v32h89.37l-52.68 52.69a16 16 0 1 0 22.62 22.62l80-80a16 16 0 0 0 0-22.62Z"/></svg>
                        Cerrar sesión
                    </button>
                    </div>
                </div>
            </main>

            {modal && 
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModal(false)}>&times;</span>
                        <h2>Actualizar Información</h2>
                        <form id="update-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre:</label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={userData.name || ''}
                                    onChange={validateField}
                                    placeholder=" "
                                />
                                {validationStates.name === false && (
                                    <span className="cartel-validator-error-profile">
                                        {cartels[0].error}
                                    </span>
                                )}
                                {validationStates.name === true && (
                                    <span className="cartel-validator-success-profile">
                                        {cartels[0].success}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="province">Provincia:</label>
                                <select
                                    id="province"
                                    name="province"
                                    defaultValue={userData.province || ''}
                                    onChange={validateField}
                                >
                                    <option value="">Seleccione una provincia</option>
                                    {provinces.map((province) => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                                {validationStates.province === false && (
                                    <span className="cartel-validator-error-profile">
                                        {cartels[1].error}
                                    </span>
                                )}
                                {validationStates.province === true && (
                                    <span className="cartel-validator-success-profile">
                                        {cartels[1].success}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">Ciudad:</label>
                                <input 
                                    type="text"
                                    id="city"
                                    name="city"
                                    defaultValue={userData.city || ''}
                                    onChange={validateField}
                                    placeholder=" "
                                />
                                {validationStates.city === false && (
                                    <span className="cartel-validator-error-profile">
                                        {cartels[2].error}
                                    </span>
                                )}
                                {validationStates.city === true && (
                                    <span className="cartel-validator-success-profile">
                                        {cartels[2].success}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone_number">Número de teléfono:</label>
                                <input 
                                    type="text"
                                    id="phone_number"
                                    name="phone_number"
                                    defaultValue={userData.phone_number || ''}
                                    onChange={validateField}
                                    placeholder=" "
                                />
                                {validationStates.phone_number === false && (
                                    <span className="cartel-validator-error-profile">
                                        {cartels[3].error}
                                    </span>
                                )}
                                {validationStates.phone_number === true && (
                                    <span className="cartel-validator-success-profile">
                                        {cartels[3].success}
                                    </span>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
                            </button>

                            {isLoading && (
                                <div className="loading-bar-container active">
                                    <div className="loading-bar">
                                        <div className="loading-bar-fill"></div>
                                    </div>
                                    <div className="loading-text">
                                        Procesando actualización...
                                    </div>
                                </div>
                            )}

                            {requestErrorState && (
                                <span className="cartel-validator-error-profile">
                                    {requestErrorState}
                                </span>
                            )}
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default Profile;
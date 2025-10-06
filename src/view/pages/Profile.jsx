import React, { useContext, useState } from "react";
import { AuthContext } from "../../viewmodel/oauth/AuthContext";
import "../../styles/profile/profile.css";
import { jwtDecode } from "jwt-decode";

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
        setValidationStates({
            name: null,
            province: null,
            city: null,
            phone_number: null,
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

        if(Object.values(validationStates).every(Boolean)) {
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
        } else {
            setRequestErrorState('Por favor, complete el formulario correctamente antes de enviar.');
        }
    }

    if (loading) {
        return (
            <div className="profile-container">
                <p>Cargando perfil...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="profile-container">
                <p>No se pudieron cargar los datos del usuario</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h1>Mi Perfil</h1>
            
            <div className="profile-info">
                <div className="profile-field">
                    <label>Nombre:</label>
                    <p>{userData.name}</p>
                </div>
                
                <div className="profile-field">
                    <label>Email:</label>
                    <p>{userData.email}</p>
                </div>

                <div className="profile-field">
                    <label>Provincia:</label>
                    <p>{userData.province}</p>
                </div>

                <div className="profile-field">
                    <label>Ciudad:</label>
                    <p>{userData.city}</p>
                </div>

                <div className="profile-field">
                    <label>Número de teléfono:</label>
                    <p>{userData.phone_number}</p>
                </div>
                
                <div className="profile-field">
                    <label>Premium:</label>
                    <p>{userData.ispremium ? 'Sí' : 'No'}</p>
                </div>
                
                <div className="profile-field">
                    <label>Verificado:</label>
                    <p>{userData.email_verified ? 'Verificado' : 'No verificado'}</p>
                </div>
            </div>
            
            <button onClick={refreshUserData} className="refresh-button">
                Actualizar datos
            </button>

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
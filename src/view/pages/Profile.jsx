import React, { useContext } from "react";
import { AuthContext } from "../../viewmodel/oauth/AuthContext";
import "../../styles/profile/profile.css";

function Profile(){
    const { userData, loading, refreshUserData } = useContext(AuthContext);

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
                    <label>Teléfono:</label>
                    <p>{userData.phone || 'No especificado'}</p>
                </div>
                
                <div className="profile-field">
                    <label>Premium:</label>
                    <p>{userData.ispremium ? '✅ Sí' : '❌ No'}</p>
                </div>
                
                <div className="profile-field">
                    <label>Verificado:</label>
                    <p>{userData.isverified ? '✅ Verificado' : '⚠️ No verificado'}</p>
                </div>
            </div>
            
            <button onClick={refreshUserData} className="refresh-button">
                Actualizar datos
            </button>
        </div>
    )
}

export default Profile;
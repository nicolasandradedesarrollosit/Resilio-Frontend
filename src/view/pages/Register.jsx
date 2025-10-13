import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoBack from '../components/others/GoBack';
import LoadingScreen from '../components/others/LoadingScreen';
import logo from '../../../public/logo-resilio-group.png';
import '../../styles/log-in-register-forgot/logInRegForg.css';
import FormRegister from '../components/log-in-register-forgot/FormRegister';

function Register() {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const contenedor = document.getElementById("top");
        if (contenedor) {
            contenedor.scrollIntoView({ behavior: "instant" });
        }

        // Verificar si ya hay una sesión activa
        const checkSession = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.ok && result.data) {
                        // Ya hay sesión activa, redirigir según rol
                        const userRole = result.data.role;
                        console.log('✅ Sesión activa detectada, redirigiendo...');
                        
                        if (userRole === 'admin') {
                            navigate('/main/admin', { replace: true });
                        } else {
                            navigate('/main/user', { replace: true });
                        }
                        return;
                    }
                }
                
                // No hay sesión, mostrar formulario de registro
                setIsChecking(false);
            } catch (error) {
                console.error('Error verificando sesión:', error);
                // En caso de error, mostrar formulario de registro
                setIsChecking(false);
            }
        };

        checkSession();
    }, [navigate]);

    // Mostrar loading mientras verifica sesión
    if (isChecking) {
        return <LoadingScreen message="Verificando sesión..." subtitle="Un momento por favor" />;
    }

    return (
        <>
            <div id='top'></div>
            <main className='main-log-in-reg-forg'>
                <nav className='navbar-log-in-reg-forg'>
                    <GoBack dominio={'/log-in'}/>
                    <div className='first-item-log-in-reg-forg'>
                        <img className='logo-log-in-reg-forg' src={logo} alt='logo' />
                    </div>
                </nav>
                <section className='container-log-in-reg-forg'>
                    <FormRegister />
                </section>
            </main>
        </>
    );
}

export default Register;
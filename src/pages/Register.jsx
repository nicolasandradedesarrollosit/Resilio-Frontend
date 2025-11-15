import { React, useEffect, useContext } from 'react';
import GoBack from '../components/others/GoBack';
import AlreadyLoggedIn from '../components/others/AlreadyLoggedIn';
import { AuthContext } from '../components/context/AuthContextOauth';
import logo from '/logo-resilio-group.png';
import '../styles/log-in-register-forgot/logInRegForg.css';
import FormRegister from '../components/log-in-register-forgot/FormRegister';

function Register() {
    const { userData, authLoading } = useContext(AuthContext);

    useEffect(() => {
        const contenedor = document.getElementById("top");
        if (contenedor) {
            contenedor.scrollIntoView({ behavior: "instant" });
        }
    }, []);

    // Si está cargando la autenticación, mostrar loading
    if (authLoading) {
        return (
            <div className="auth-loading-screen">
                <div className="auth-loading-spinner"></div>
            </div>
        );
    }

    // Si el usuario ya está logueado, mostrar el modal de sesión activa
    if (userData) {
        return <AlreadyLoggedIn />;
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
import {React, useEffect} from 'react';
import logo from '/logo-resilio-group.png';
import GoBack from '../components/others/GoBack';
import '../styles/log-in-register-forgot/logInRegForg.css'
import ForgotPasswordForm from '../components/log-in-register-forgot/FormForgot';

function ForgotPassword() {
    useEffect(() => {
            const contenedor = document.getElementById("top");
            if (contenedor) {
                contenedor.scrollIntoView({ behavior: "instant" });
            }
        }, []);

    return (
        <>
            <div id='top'></div>
            <main className='main-log-in-reg-forg'>
                <nav className='navbar-log-in-reg-forg'>
                    <GoBack dominio={'/'}/>
                    <div className='first-item-log-in-reg-forg'>
                        <img className='logo-log-in-reg-forg' src={logo} alt='logo' />
                    </div>
                </nav>
                <section className='container-log-in-reg-forg'>
                    <ForgotPasswordForm />
                </section>
            </main>
        </>
    );
}

export default ForgotPassword;
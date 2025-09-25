import { React, useEffect } from 'react';
import GoBack from '../components/others/GoBack';
import logo from '../../../public/logo-resilio-group.png';
import '../../styles/log-in-register-forgot/logInRegForg.css';
import FormRegister from '../components/log-in-register-forgot/FormRegister';

function Register() {
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
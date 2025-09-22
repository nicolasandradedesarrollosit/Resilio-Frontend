import { React, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoBack from '../components/others/GoBack';
import FormLogIn from '../components/log-in/FormLogIn';
import logo from '../../../public/logo-resilio-group.png';
import '../../styles/log-in/logIn.css';

function LogIn() {
    useEffect(() => {
        const contenedor = document.getElementById("top");
        if (contenedor) {
            contenedor.scrollIntoView({ behavior: "instant" });
        }
    }, []);
    
    return (
        <>
            <div id='top'></div>
            <main className='main-login'>
                <nav className='navbar-login'>
                    <GoBack dominio={'/'}/>
                    <div className='first-item-login'>
                        <img className='logo-login' src={logo} alt='logo' />
                    </div>
                </nav>
                <section className='container-form-login'>
                    <FormLogIn />
                </section>
            </main>
        </>
    )
}

export default LogIn;
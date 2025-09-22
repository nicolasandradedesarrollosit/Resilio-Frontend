import React, { useEffect } from "react";
import GoBack from "../components/others/GoBack";
import '../../styles/contact/contact.css';
import FormContact from "../components/contact/FormContact";
import ContactWays from '../components/contact/ContactWays';

function Contact(){
    useEffect(() => {
        const contenedor = document.getElementById("top");
        if (contenedor) {
        contenedor.scrollIntoView({ behavior: "instant" });
        }
    }, []);
    
    return(
        <>
            <div id="top"></div>
            <div className="bg-contact">
                <header className="header-contact" id="top">
                    <GoBack dominio={'/'}/>
                </header>
                <main className="main-contact">
                    <section className="text-contact">
                        <span className="upper-subtitle-text">¿Tienes una pregunta?</span>
                        <span className="title-text">Contáctanos</span>
                        <span className="down-subtitle-text">Buscaremos resolver cualquier duda que tengas en el corto plazo</span>
                    </section>
                    <section className="container-sections">
                        <FormContact />
                        <ContactWays />
                    </section>
                </main>
            </div>
        </>
    );
}

export default Contact;
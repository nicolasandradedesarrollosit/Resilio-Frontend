import { React, useState } from "react";
import '../../styles/contact/contactWays.css';

function ContactWays(){
    const ubication = () => {
        window.open("https://www.google.com/maps/place/Rosario,+Santa+Fe,+Argentina", "_blank");
    }

    const whatsapp = () => {
        window.open("https://wa.me/5493413371461", "_blank");
    }

    const phone = () => {
        window.location.href = "tel:+5493413371461";
    }

    return(
        <>
            <div className="contact-methods">
                <h2 className="contact-title">Contacto directo</h2>

                <div className="contact-item" onClick={phone}>
                    <div className="contact-icon">
                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 26 26"><path fill="#000000" d="M22.386 18.026c-1.548-1.324-3.119-2.126-4.648-.804l-.913.799c-.668.58-1.91 3.29-6.712-2.234c-4.801-5.517-1.944-6.376-1.275-6.951l.918-.8c1.521-1.325.947-2.993-.15-4.71l-.662-1.04C7.842.573 6.642-.552 5.117.771l-.824.72c-.674.491-2.558 2.087-3.015 5.119c-.55 3.638 1.185 7.804 5.16 12.375c3.97 4.573 7.857 6.87 11.539 6.83c3.06-.033 4.908-1.675 5.486-2.272l.827-.721c1.521-1.322.576-2.668-.973-3.995l-.931-.801z"/>
                        </svg></div>
                    <div className="contact-text">
                        <div className="contact-label">Teléfono</div>
                        <div className="contact-value">+54 9 341 337-1461</div>
                    </div>
                </div>

                <div className="contact-item" onClick={ubication}>
                    <div className="contact-icon">
                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 20 20"><path fill="#000000" d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4a2 2 0 0 0 0 4z"/></svg>
                        </div>
                    <div className="contact-text">
                        <div className="contact-label">Ubicación</div>
                        <div className="contact-value">Rosario, Santa Fe, Argentina</div>
                    </div>
                </div>

                <div className="contact-item" onClick={whatsapp}>
                    <div className="contact-icon">
                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1024 1024"><path fill="#000000" d="M544 960q-124 0-233-60L0 1024l124-311Q64 604 64 480q0-98 38-186.5t102.5-153T357.5 38T544 0t186.5 38t153 102.5t102.5 153t38 186.5t-38 186.5t-102.5 153t-153 102.5T544 960zm160-384h-64l-36 32q-45-12-110.5-77.5T416 420l32-36v-64q0-17-12-34t-26.5-24.5T389 260l-47 47q-39 39-11.5 121.5t105 160t160 105T717 682l47-47q6-6-1.5-20.5T738 588t-34-12z"/>
                        </svg>
                        </div>
                    <div className="contact-text">
                        <div className="contact-label">WhatsApp</div>
                        <div className="contact-value">Chatea con nosotros</div>
                    </div>
                </div>

                <div className="contact-item">
                    <div className="contact-icon">
                        <svg className="svg" class="svg" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64L12 9.548l6.545-4.91l1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                        </svg>
                        </div>
                    <div className="contact-text">
                        <div className="contact-label">Mail</div>
                        <div className="contact-value">resiliog@gmail.com</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactWays;

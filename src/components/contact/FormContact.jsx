import React, { useState } from "react";
import '../../styles/contact/formContact.css';

function FormContact(){
    const [validationStates, setValidationStates] = useState({
        name: null,
        subject: null, 
        message: null
    });

    const validations = [
        {
            id: "name",
            regex: /^.{6,}$/
        },
        {
            id: "phone",
            regex: /^\d{9,13}$/
        },
        {
            id: "brand", 
            regex: /^(?!\s*$).+/
        },
        {
            id: "subject", 
            regex: /^(?!\s*$).+/
        },
        {
            id: "message",
            regex: /^(?!\s*$).+/
        }
    ];

    const cartels = [
        {
            error: "El nombre debe tener más de 5 letras",
            success: "El nombre es correcto"
        },
        {
            error: "El teléfono debe tener entre 9 y 13 números",
            success: "El teléfono es correcto"
        },
        {
            error: "El nombre de tu marca no puede estar vacío",
            success: "El nombre de tu marca es correcto"
        },
        {
            error: "El asunto no puede estar vacío",
            success: "El asunto es correcto"
        },
        {
            error: "El mensaje no puede estar vacío", 
            success: "El mensaje es correcto"
        }
    ];

    const validateField = (e) => {
        const id = e.target.id;
        const content = e.target.value; 
        
        validations.forEach((item) => { 
        if(item.id === id){
            const isValid = validate(content, item.regex);
            
            setValidationStates(prev => ({
            ...prev,
            [id]: isValid
            }));
        }
        });
    };

    const validate = (fieldValue, regex) => { 
        return regex.test(fieldValue.trim());
    };

    const validateAllFields = (formData) => {
        const name = formData.get('name');
        const subject = formData.get('subject');
        const message = formData.get('message');
        const phone = formData.get('phone');
        const brand = formData.get('brand');

        const errors = [];
        
        if (!name || name.trim().length < 6) {
            errors.push('1');
        }

        if (!phone || phone.trim().length < 9 && phone.trim().length > 13) {
            errors.push('2');
        }

        if(!brand || brand.trim() === ''){
            errors.push('3')
        }
    
        if (!subject || subject.trim() === '') {
            errors.push('4');
        }
        
        if (!message || message.trim() === '') {
            errors.push('5');
        }

        return {
            isValid: errors.length === 0,
            errors,
            data: { name: name?.trim(), phone: phone?.trim(), brand: brand?.trim(), subject: subject?.trim(), message: message?.trim() }
        };
    };

    const sendSmartEmail = async (to, subject, body) => {
        const emailClients = {
            gmail: {
                name: 'Gmail',
                url: 'https://mail.google.com/mail/?view=cm&fs=1',
                domains: ['gmail.com', 'googlemail.com'],
                detectUrl: 'https://accounts.google.com'
            },
            outlook: {
                name: 'Outlook',
                url: 'https://outlook.live.com/owa/?path=/mail/action/compose',
                domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
                detectUrl: 'https://login.microsoftonline.com'
            },
            yahoo: {
                name: 'Yahoo Mail',
                url: 'https://compose.mail.yahoo.com/',
                domains: ['yahoo.com', 'yahoo.es', 'ymail.com'],
                detectUrl: 'https://login.yahoo.com'
            },
            icloud: {
                name: 'iCloud Mail',
                url: 'https://www.icloud.com/mail',
                domains: ['icloud.com', 'me.com', 'mac.com'],
                detectUrl: 'https://www.icloud.com'
            }
        };

        const buildEmailUrl = (client, to, subject, body) => {
            let url;
            switch (client) {
                case 'gmail':
                    url = `${emailClients.gmail.url}&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    break;
                case 'outlook':
                    url = `${emailClients.outlook.url}&to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    break;
                case 'yahoo':
                    url = `${emailClients.yahoo.url}?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    break;
                case 'icloud':
                    url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    break;
                default:
                    url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }
            
            return url;
        };

        const detectPreferredClient = () => {
            const cookies = document.cookie;
            
            if (cookies.includes('gmail') || cookies.includes('google')) {
                return 'gmail';
            }
            if (cookies.includes('outlook') || cookies.includes('live') || cookies.includes('microsoft')) {
                return 'outlook';
            }
            if (cookies.includes('yahoo')) {
                return 'yahoo';
            }
            if (cookies.includes('icloud') || cookies.includes('apple')) {
                return 'icloud';
            }
            
            try {
                const preferredClient = localStorage.getItem('preferredEmailClient');
                if (preferredClient && emailClients[preferredClient]) {
                    return preferredClient;
                }
            } catch (e) {
            }
            
            return null;
        };

        const showClientSelector = () => {
            return new Promise((resolve) => {
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(15, 23, 42, 0.9);
                    backdrop-filter: blur(20px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    font-family: inherit;
                `;

                const content = document.createElement('div');
                content.style.cssText = `
                    background: rgba(30, 41, 59, 0.95);
                    backdrop-filter: blur(20px);
                    padding: 3rem;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    text-align: center;
                    max-width: 450px;
                    width: 90%;
                    animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                `;

                content.innerHTML = `
                    <style>
                        @keyframes modalSlideIn {
                            from {
                                opacity: 0;
                                transform: translateY(-20px) scale(0.95);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }

                        .svg{
                            height: 30px;
                            width: 30px;
                        }

                        .email-btn {
                            width: 100%;
                            padding: 1rem 1.5rem;
                            margin: 0.5rem 0;
                            border: 2px solid rgba(148, 163, 184, 0.2);
                            border-radius: 15px;
                            background: rgba(30, 41, 59, 0.8);
                            color: #f8fafc;
                            cursor: pointer;
                            font-size: 1rem;
                            font-weight: 500;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0.75rem;
                        }
                        .email-btn:hover {
                            transform: translateY(-2px);
                            border-color: #8b5cf6;
                            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
                            background: rgba(139, 92, 246, 0.1);
                        }
                        .email-btn.gmail:hover { border-color: #ea4335; box-shadow: 0 0 20px rgba(234, 67, 53, 0.3); }
                        .email-btn.outlook:hover { border-color: #0078d4; box-shadow: 0 0 20px rgba(0, 120, 212, 0.3); }
                        .email-btn.yahoo:hover { border-color: #7b0099; box-shadow: 0 0 20px rgba(123, 0, 153, 0.3); }
                        .email-btn.icloud:hover { border-color: #007aff; box-shadow: 0 0 20px rgba(0, 122, 255, 0.3); }
                    </style>
                    <h3 style="margin-bottom: 2rem; color: #f8fafc; font-size: 1.5rem; font-weight: 600;">
                        ¿Cuál es tu cliente de email preferido?
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button id="gmail-btn" class="email-btn gmail">
                            <span style="font-size: 1.2rem;"><svg class="svg" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64L12 9.548l6.545-4.91l1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg></span> Gmail
                        </button>
                        <button id="outlook-btn" class="email-btn outlook">
                            <span style="font-size: 1.2rem;"><svg class="svg" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 432 432"><path fill="#000000" d="M267 93h145q4 0 9.5 5t5.5 12l-127 85h-4l-29-18V93zm0 115l27 18q2 1 4 1h3l1-1q-2 1 29-19.5t64-41.5l32-21v153q0 12-6.5 18t-16.5 6H267V208zm-139-39q13 0 20.5 12.5T156 216t-7.5 34t-21.5 12q-13 0-21-12.5T98 216t8-34t22-13zM0 51L251 3v426L0 377V51zm168 218q16-21 16-54t-15.5-53.5T128 141q-26 0-42 21t-16 56q0 32 16 52t41 20t41-21z"/></svg></span> Outlook
                        </button>
                        <button id="yahoo-btn" class="email-btn yahoo">
                            <span style="font-size: 1.2rem;"><svg class= 'svg' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M10.5 7.59L8.16 13.2L5.85 7.59H2l4.29 9.64l-1.54 3.47H8.5l5.74-13.11H10.5m4.5 5.14c-1.37 0-2.41 1.04-2.41 2.27c0 1.17 1 2.16 2.34 2.16c1.39 0 2.43-1.03 2.43-2.26c0-1.21-1-2.17-2.36-2.17m2.72-9.43l-3.83 8.59h4.28L22 3.3h-4.28Z"/></svg></span> Yahoo Mail
                        </button>
                        <button id="icloud-btn" class="email-btn icloud">
                            <span style="font-size: 1.2rem;"><svg class='svg' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332a3.571 3.571 0 0 0-1.558-.36a3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914a4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508a6.51 6.51 0 0 0-6.511-6.27z"/></svg></span> iCloud
                        </button>
                        <button id="other-btn" class="email-btn">
                            <span style="font-size: 1.2rem;"><svg class = "svg"  xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 14 14"><path fill="#000000" fill-rule="evenodd" d="M13.854.146a.5.5 0 0 1 .113.534l-5 13a.5.5 0 0 1-.922.027l-2.091-4.6L9.03 6.03a.75.75 0 0 0-1.06-1.06L4.893 8.046l-4.6-2.09a.5.5 0 0 1 .028-.923l13-5a.5.5 0 0 1 .533.113" clip-rule="evenodd"/></svg></span> Otro
                        </button>
                    </div>
                `;

                modal.appendChild(content);
                document.body.appendChild(modal);

                const handleSelection = (client) => {
                    try {
                        localStorage.setItem('preferredEmailClient', client);
                    } catch (e) {
                    }
                    document.body.removeChild(modal);
                    resolve(client);
                };

                document.getElementById('gmail-btn').onclick = () => handleSelection('gmail');
                document.getElementById('outlook-btn').onclick = () => handleSelection('outlook');
                document.getElementById('yahoo-btn').onclick = () => handleSelection('yahoo');
                document.getElementById('icloud-btn').onclick = () => handleSelection('icloud');
                document.getElementById('other-btn').onclick = () => handleSelection('other');

                modal.onclick = (e) => {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                        resolve('other');
                    }
                };
            });
        };

        try {
            let preferredClient = detectPreferredClient();
            
            if (!preferredClient) {
                preferredClient = await showClientSelector();
            }

            const emailUrl = buildEmailUrl(preferredClient, to, subject, body);
            
            if (preferredClient === 'icloud') {
                window.open(emailUrl, '_blank');
                alert(`Se abrió iCloud Mail. Por favor:\n1. Haz clic en "Redactar"\n2. Añade el destinatario: ${to}\n3. Asunto: ${subject}\n4. Copia este mensaje:\n\n${body}`);
            } else if (preferredClient === 'other') {
                window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            } else {
                window.open(emailUrl, '_blank');
            }

            
        } catch (error) {
            window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
    };

        const submitMail = (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            
            const validation = validateAllFields(formData);
            
            if (!validation.isValid) {
                return;
            }
            
            const emailBody = `Hola,

            Mi nombre es: ${validation.data.name}

            Mi número de teléfono es: ${validation.data.phone}

            El nombre de mi marca es: ${validation.data.brand}

            Mensaje:
            ${validation.data.message}

            ---
            Enviado desde el formulario de contacto de tu sitio web.`;
                
            const destinationEmail = 'resiliog@gmail.com';
            
            sendSmartEmail(destinationEmail, validation.data.subject, emailBody);
        };

  return(
    <>
      <div className="form-container">
        <h2 className="form-title">Cuéntanos tu proyecto</h2>
        <form id="contactForm" className="contact-form" onSubmit={submitMail}>
            <div className="field-form">
                <input
                id="name"
                name="name" 
                type="text"
                placeholder=" "
                onChange={validateField}
                />
                <label htmlFor="name">Nombre completo</label>
                
                {validationStates.name === false && (
                    <span className="cartel-validator-error">
                        {cartels[0].error}
                    </span>
                )}
                {validationStates.name === true && (
                <span className="cartel-validator-success">
                    {cartels[0].success}
                </span>
                )}
            </div>
            
            <div className="field-form">
                <input
                id="phone"
                name="phone"
                type="text" 
                placeholder=" "
                onChange={validateField}
                />
                <label htmlFor="phone">Teléfono</label>
            
                {validationStates.phone === false && (
                <span className="cartel-validator-error">
                    {cartels[1].error}
                </span>
                )}
                {validationStates.phone === true && (
                <span className="cartel-validator-success">
                    {cartels[1].success}
                </span>
                )}
            </div>

            <div className="field-form">
                <input
                id="brand"
                name="brand"
                type="text" 
                placeholder=" "
                onChange={validateField}
                />
                <label htmlFor="brand">Nombre de tu marca</label>
            
                {validationStates.brand === false && (
                <span className="cartel-validator-error">
                    {cartels[2].error}
                </span>
                )}
                {validationStates.brand === true && (
                <span className="cartel-validator-success">
                    {cartels[2].success}
                </span>
                )}
            </div>

            <div className="field-form">
                <input
                id="subject"
                name="subject"
                type="text" 
                placeholder=" "
                onChange={validateField}
                />
                <label htmlFor="subject">Asunto</label>
            
                {validationStates.subject === false && (
                <span className="cartel-validator-error">
                    {cartels[3].error}
                </span>
                )}
                {validationStates.subject === true && (
                <span className="cartel-validator-success">
                    {cartels[3].success}
                </span>
                )}
            </div>

            <div className="field-form">
                <textarea
                id="message"
                name="message"
                placeholder=" " 
                onChange={validateField}
                ></textarea>
                <label htmlFor="message">Cuéntanos sobre tu proyecto</label>
                
                {validationStates.message === false && (
                <span className="cartel-validator-error">
                    {cartels[4].error}
                </span>
                )}
                {validationStates.message === true && (
                <span className="cartel-validator-success">
                    {cartels[4].success}
                </span>
                )}
            </div>

            <div className="submit-container">
                <button type="submit" className="submit-btn">
                Enviar mensaje
                </button>
            </div>
        </form>
      </div>
    </>
  );
}

export default FormContact;
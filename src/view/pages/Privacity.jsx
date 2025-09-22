import React, { useEffect } from 'react';
import GoBack from '../components/others/GoBack';
import { Link } from 'react-router-dom';
import '../../styles/legal/legal.css';
import logo from '../../../public/logo-resilio-group.png';

function Privacity(){
    useEffect(() => {
      const contenedor = document.getElementById("top");
      if (contenedor) {
        contenedor.scrollIntoView({ behavior: "instant" });
      }
    }, []);
    
    return(
      <>
        <div id='top'></div>

        <main className='main-section-legal'>
          <nav className='navbar-legal'>
            <div className='first-item-legal'>
              <img className='logo-legal' src={logo} alt='logo' />
            </div>
          </nav>

          <div className='container-section-legal'>
            <aside className='aside-section-legal'>
              <GoBack dominio={'/'} />
              <span className='title-aside-legal'>Información legal</span>
              <Link className='item-link-legal' to={'/service'}>Términos de servicio</Link>
              <Link id='active' className='item-link-legal' to={'/privacity'}>Política de privacidad</Link>
            </aside>

            <section className='content-section-legal'>
              <h1 className='title-content-legal'>Política de privacidad</h1>
              <div className='content-legal'>
                <p>Tu privacidad es importante. Esta Política explica cómo recopilamos, usamos, compartimos y protegemos tu información personal al utilizar nuestra Plataforma de beneficios y descuentos.</p>

                <h3>Responsable del tratamiento</h3>
                <p>La empresa titular de la Plataforma es la responsable del tratamiento de los datos personales que nos proporcionás o que se generan por tu uso del servicio.</p>

                <h3>Datos que tratamos</h3>
                <ul>
                  <li><strong>Identificación y contacto:</strong> nombre, correo electrónico, teléfono.</li>
                  <li><strong>Datos de uso:</strong> actividad en la app/web, cupones utilizados, preferencias.</li>
                  <li><strong>Técnicos:</strong> dirección IP, identificadores de dispositivo, cookies y tecnologías similares.</li>
                  <li><strong>Facturación (si aplica):</strong> información transaccional limitada. Los pagos se procesan con proveedores PCI-DSS; no almacenamos datos sensibles de tarjetas.</li>
                </ul>

                <h3>Finalidades</h3>
                <ul>
                  <li>Prestar y mantener el servicio (gestión de cuenta, funcionalidades, soporte).</li>
                  <li>Personalizar la experiencia, recomendar beneficios y medir el rendimiento.</li>
                  <li>Comunicaciones operativas y, si lo autorizás, comerciales.</li>
                  <li>Cumplimiento legal y prevención del fraude.</li>
                </ul>

                <h3>Base legal</h3>
                <p>Tratamos datos sobre la base de la ejecución del contrato (Términos), tu consentimiento cuando corresponda (por ejemplo, marketing), el interés legítimo (mejoras, seguridad) y el cumplimiento de obligaciones legales.</p>

                <h3>Cesiones y encargados</h3>
                <p>No vendemos tus datos. Compartimos de forma limitada con proveedores tecnológicos (alojamiento, analítica, comunicaciones) y con Afiliados para gestionar redenciones, siempre bajo acuerdos de confidencialidad y protección de datos.</p>

                <h3>Transferencias internacionales</h3>
                <p>Si hubiera transferencias fuera de tu país, implementaremos salvaguardas adecuadas (cláusulas contractuales estándar u otros mecanismos reconocidos).</p>

                <h3>Conservación</h3>
                <p>Conservamos los datos durante la relación con vos y por los plazos necesarios para cumplir obligaciones legales o defender derechos. Luego aplicamos supresión o anonimización.</p>

                <h3>Seguridad</h3>
                <ul>
                  <li>Cifrado en tránsito (HTTPS/TLS) y controles de acceso.</li>
                  <li>Políticas de contraseñas, registro de eventos y copias de seguridad.</li>
                  <li>Evaluaciones periódicas y principio de minimización de datos.</li>
                </ul>

                <h3>Tus derechos</h3>
                <p>Podés ejercer derechos de acceso, actualización, rectificación y supresión; así como oposición y limitación cuando corresponda. También podés revocar el consentimiento en cualquier momento.</p>

                <h3>Cookies</h3>
                <p>Usamos cookies propias y de terceros para funcionamiento y analítica. Podés gestionarlas desde tu navegador o desde un banner/centro de preferencias si está disponible.</p>

                <h3>Contacto</h3>
                <p>Para consultas o ejercicios de derechos, escribinos a <a className='link-mail-to' href='mailto:resiliog@gmail.com'>resiliog@gmail.com</a>.</p>

                <div className='callout-legal'>
                  Última actualización: 15 de septiembre de 2025.
                </div>
              </div>
            </section>
          </div>
        </main>
      </>
    )
}

export default Privacity;
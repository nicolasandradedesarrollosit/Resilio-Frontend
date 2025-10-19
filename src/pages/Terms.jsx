import React, { useEffect } from 'react';
import GoBack from '../components/others/GoBack';
import { Link } from 'react-router-dom';
import '../styles/legal/legal.css';
import logo from '/logo-resilio-group.png';

function Terms(){
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
              <Link id='active' className='item-link-legal' to={'/service'}>Términos de servicio</Link>
              <Link className='item-link-legal' to={'/privacity'}>Política de privacidad</Link>
            </aside>

            <section className='content-section-legal'>
              <h1 className='title-content-legal'>Términos de servicio</h1>
              <div className='content-legal'>
                <p>Bienvenido/a a nuestra plataforma SaaS de beneficios y descuentos (la “Plataforma”). Al acceder o utilizar el servicio, usted acepta estos Términos de Servicio (“Términos”). Si no está de acuerdo, no utilice la Plataforma.</p>

                <h3>Objeto del servicio</h3>
                <p>Brindamos acceso a beneficios, cupones y descuentos ofrecidos por comercios afiliados (“Afiliados”). La Plataforma actúa como intermediaria y no es vendedora de los productos/servicios que promociona.</p>

                <h3>Registro y cuenta</h3>
                <ul>
                  <li>Para acceder a determinadas funciones se requiere registro y verificación de correo.</li>
                  <li>Usted es responsable de mantener la confidencialidad de sus credenciales y de toda actividad bajo su cuenta.</li>
                  <li>Podremos suspender o cancelar cuentas que incumplan estos Términos o que presenten uso fraudulento.</li>
                </ul>

                <h3>Planes, pagos y renovaciones</h3>
                <ul>
                  <li>Ofrecemos planes gratuitos y/o de pago con distinta disponibilidad de funciones.</li>
                  <li>Los precios y condiciones se informan antes de la compra. Las suscripciones pueden renovarse automáticamente, salvo cancelación o indicación en contrario.</li>
                  <li>Los impuestos aplicables pueden incluirse o añadirse según la normativa vigente.</li>
                </ul>

                <h3>Ofertas y relación con Afiliados</h3>
                <ul>
                  <li>Las ofertas son responsabilidad de los Afiliados (disponibilidad, condiciones, stock y vigencia).</li>
                  <li>Nos reservamos el derecho de modificar, suspender o finalizar ofertas que no cumplan estándares de calidad o legalidad.</li>
                  <li>No garantizamos resultados ni la continuidad de una oferta concreta.</li>
                </ul>

                <h3>Uso permitido y restricciones</h3>
                <ul>
                  <li>No se permite el uso con fines ilícitos, abusivos, de scraping masivo o que afecte la seguridad del servicio.</li>
                  <li>Está prohibida la reventa de beneficios, el intento de eludir controles o manipular condiciones de una promoción.</li>
                  <li>Podemos aplicar límites razonables de uso para preservar la estabilidad de la Plataforma.</li>
                </ul>

                <h3>Propiedad intelectual</h3>
                <p>El software, el diseño, las marcas y todo contenido propio pertenecen a la empresa. No se concede licencia distinta de la necesaria para usar la Plataforma según estos Términos.</p>

                <h3>Privacidad y datos</h3>
                <p>El tratamiento de datos personales se rige por nuestra <Link to='/privacity'>Política de Privacidad</Link>. Al usar la Plataforma, usted declara conocerla y aceptarla.</p>

                <h3>Disponibilidad, soporte y cambios</h3>
                <ul>
                  <li>Podemos actualizar o modificar funcionalidades, así como realizar mantenimientos planificados o de emergencia.</li>
                  <li>Ofrecemos soporte en la medida de los planes contratados y de acuerdo con nuestros canales oficiales.</li>
                </ul>

                <h3>Responsabilidad</h3>
                <p>La Plataforma se ofrece “tal cual” y “según disponibilidad”. En la máxima medida permitida por la ley, no respondemos por daños indirectos, lucro cesante o pérdida de datos derivados del uso del servicio. Los Afiliados son responsables por sus ofertas y atención al cliente.</p>

                <h3>Terminación</h3>
                <p>Podemos suspender o cancelar su cuenta en caso de incumplimiento. Usted puede cancelar en cualquier momento; las obligaciones devengadas (por ejemplo, pagos vencidos) subsistirán.</p>

                <h3>Ley aplicable y jurisdicción</h3>
                <p>Estos Términos se rigen por las leyes de la República Argentina. Para cualquier conflicto, las partes se someten a los tribunales competentes de la Ciudad Autónoma de Buenos Aires, salvo norma imperativa en contrario.</p>

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

export default Terms;
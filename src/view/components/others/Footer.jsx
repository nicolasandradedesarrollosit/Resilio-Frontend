import React from "react";
import { Link } from 'react-router-dom';
import '../../../styles/others/footer.css';

function Footer(){
    return(
        <>
            <div className="container-rows-footer">
                <div className="row-1-footer">
                    <Link className="item" to={'/contact'}>Contacto</Link>
                    <Link className="item" to={'/service'}>Términos de servicio</Link>
                    <Link className="item" to={'/privacity'}>Política de privacidad</Link>
                </div>
                <div className="row-2-footer">
                    <span>Resilio Group ® Todos los derechos reservados.</span>
                </div>
            </div>
        </>
    );
}

export default Footer;
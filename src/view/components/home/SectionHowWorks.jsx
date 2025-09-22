import React from "react";
import '../../../styles/home/sectionHowWorks.css'

function SectionHowWorks(){
    const howWorks = [
    {
        svg: (
            <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 17 16"><path fill="#FFFF" fill-rule="evenodd" d="M15.016 0v1.031h-1.062V0h-.895v1.031h-1.09V0h-.953v1.031H9.954V0h-.922v1.031H7.941V0h-.925v1.031H5.985V0h-.942v1.031H3.959V0H3v16h12.954V0h-.938zM5 6.958h9v1H5v-1zm9 5H5v-1h9v1zM14 10H5V9h9v1z"/></svg>
        ),
        name: "1. Registrate",
        content: "Creá tu cuenta en pocos pasos y accedé a los planes de nuestra red de beneficios exclusivos."
    },
    {
        svg: (
            <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#fff" d="M2.284 22.158c.001.95.679 1.752 1.62 1.792c1.31.055 2.623.022 3.935.022c.954 0 1.786-.865 1.76-1.954c-.029-1.221.018-2.445.029-3.667l.045-4.988c.003-.305.046-.362.335-.44a4.242 4.242 0 0 1 2.013-.067c1.23.262 2.129 1.21 2.261 2.46c.066.62.07 1.249.078 1.874c.025 1.64.038 3.28.054 4.921c.01 1.087.796 1.877 1.883 1.882c1.171.006 2.342.008 3.513.007c1.106-.002 1.895-.778 1.898-1.883c.007-3.371.007-6.742.01-10.113c0-.052 0-.105-.005-.156c-.03-.355-.169-.658-.483-.838a2.638 2.638 0 0 0-.695-.291a7.484 7.484 0 0 0-2.887-.123c-.743.113-1.476.293-2.213.442c-.97.196-1.946.28-2.934.178c-1.268-.129-2.37-.666-3.402-1.38a32.36 32.36 0 0 0-1.494-.984c-.62-.38-1.314-.505-2.03-.544c-.77-.043-1.536-.063-2.293.111c-.59.136-.899.479-.966 1.077a3.438 3.438 0 0 0-.021.379m7.337-6.184a3.675 3.675 0 1 0-7.35-.031a3.675 3.675 0 0 0 7.35.03zm8.335-1.81a3.673 3.673 0 0 0-3.69 3.652a3.672 3.672 0 0 0 3.67 3.697a3.678 3.678 0 0 0 3.68-3.665a3.677 3.677 0 0 0-3.66-3.685Z"/></svg>
        ),
        name: "2. Elegí tu partner",
        content: "Explorá las marcas asociadas, activá tus beneficios y empezá a ahorrar."
    },
    {
        svg: (
            <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 48 48"><mask id="ipSFireworks0"><g fill="none"><path fill="#FFFF" stroke="#FFFF" stroke-linejoin="round" stroke-width="4" d="m6 42l8.674-24.736L31 34.038L6 42Z"/><path stroke="#FFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m23 19l5-5c2.667-2.667 3-5 1-7m0 18l5-5c3.333-3.333 6.667-3.333 10 0"/><path fill="#FFFF" d="M20 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm22-1a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 23a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm-3 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/></g></mask><path fill="#FFFF" d="M0 0h48v48H0z" mask="url(#ipSFireworks0)"/></svg>
        ),
        name: "3. Disfrutá las recompensas",
        content: "Acumulá puntos, recibí descuentos y accedé a promociones especiales."
    }
    ];

    return(
        <>
            <span className="title-section-how-work">
                ¿Cómo funciona?
            </span>
            <div className="container-cards-how-work">
                {howWorks.map((item) => {
                    return(
                        <div className="card-item-how-work">
                            <div className="content-card-item">
                                <div className="container-svg-how-work">{item.svg}</div>
                                <span className="title-item-how-work">{item.name}</span>
                                <span className="content-item-how-work">{item.content}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default SectionHowWorks;
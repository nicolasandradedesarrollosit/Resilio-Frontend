import React from "react";
import '../../styles/home/sectionFeatures.css';

function SectionFeatures(){
    const features = [
        {
            svg:(
                <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512"><path fill="#FFF" d="M32 376a56 56 0 0 0 56 56h336a56 56 0 0 0 56-56V222H32Zm66-76a30 30 0 0 1 30-30h48a30 30 0 0 1 30 30v20a30 30 0 0 1-30 30h-48a30 30 0 0 1-30-30ZM424 80H88a56 56 0 0 0-56 56v26h448v-26a56 56 0 0 0-56-56Z"/></svg>
            ),
            name:"Descuentos exclusivos",
            content:"Accedé a precios preferenciales en marcas asociadas."
        },
        {
            svg:(
                <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 26 26"><path fill="#FFF" d="M25.326 10.137a1.001 1.001 0 0 0-.807-.68l-7.34-1.066l-3.283-6.651c-.337-.683-1.456-.683-1.793 0L8.82 8.391L1.48 9.457a1 1 0 0 0-.554 1.705l5.312 5.178l-1.254 7.31a1.001 1.001 0 0 0 1.451 1.054L13 21.252l6.564 3.451a1 1 0 0 0 1.451-1.054l-1.254-7.31l5.312-5.178a.998.998 0 0 0 .253-1.024z"/></svg>
            ),
            name:"Acumulación de puntos",
            content:"Sumá puntos en cada compra y canjealos por más beneficios."
        },
        {
            svg:(
                <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#FFF" d="M22.6 2.1c-.1-.3-.4-.6-.7-.7c-4.2-1.1-8.5.2-11.4 3.6L9.4 6.3l-2.7-.6C5.4 5.2 4 5.8 3.4 7l-2.2 3.9c-.2.3-.2.6 0 .9c.1.3.4.5.7.6l3.1.7c-.3.8-.4 1.6-.6 2.4c0 .3.1.6.3.8l3.1 3.1c.2.2.4.3.7.3h.1c.9-.1 1.7-.2 2.5-.5l.6 3c.1.3.3.6.6.7c.1.1.3.1.4.1c.2 0 .3 0 .5-.1l3.9-2.2c1.1-.6 1.7-2 1.4-3.3l-.7-2.8l1.2-1.1c3.3-2.8 4.7-7.3 3.6-11.4zM7.3 8.8c-.6.8-1.2 1.6-1.6 2.4l-2.1-.5L5.1 8c.2-.4.6-.5 1.1-.4l1.7.4l-.6.8zM16 18.9l-2.7 1.5l-.4-2c.9-.4 1.7-1 2.4-1.6l.7-.7l.4 1.7c.2.5-.1 1-.4 1.1zm.7-10.1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5s1.5.7 1.5 1.5s-.6 1.5-1.5 1.5z"/></svg>
            ),
            name:"Acceso prioritario",
            content:"Entrá primero a promociones y lanzamientos limitados."
        },
        {
            svg:(
                <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 8 8"><path fill="#FFF" d="M1.19 0C1.08 0 1 .08 1 .19v7.63c0 .11.08.19.19.19h4.63c.11 0 .19-.08.19-.19V.19c0-.11-.08-.19-.19-.19H1.19zM2 1h3v5H2V1zm1.5 5.5c.28 0 .5.22.5.5s-.22.5-.5.5S3 7.28 3 7s.22-.5.5-.5z"/></svg>
            ),
            name:"Gestión simple",
            content:"Todo desde una app centralizada, fácil y rápida."
        }
    ];

    return(
        <>
            <span className="title-section-features">
                Descubrí todo lo que podés hacer
            </span>
            <span className="subtitle-section-features">
                Herramientas diseñadas para simplificar tu día y potenciar tu experiencia
            </span>
            <div className="container-cards">
                {features.map((item) => {
                    return(
                        <div className="card-item">
                            <div className="item-svg">{item.svg}</div>
                            <span className="title-card">{item.name}</span>
                            <span className="subtitle-card">{item.content}</span>
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default SectionFeatures;
import React from 'react';
import '../../../styles/home/mainSection.css';
import SectionFeatures from './SectionFeatures';
import SectionHowWorks from './SectionHowWorks';

function MainSectionHome(){
    const stats = [
        {
            stat: "+200",
            name: "Locales con beneficios"
        },
        {
            stat: "+600",
            name: "Usuarios registrados"
        },
        {
            stat: "+50",
            name: "Nuevos beneficios cada semana"
        }
    ];
    return(
        <>
            <main className='section-main-home'>
                <div className='video-demo-main'>
                    <iframe width="560" height="315"
                        className='video-demo' 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <section id='features' className='container-section-features'>
                    <SectionFeatures />
                </section>
                <section className='container-section-how-works'>
                    <SectionHowWorks />
                </section>
                <section className='container-stats-section'>
                        {stats.map((item) => {
                            return(
                                <div className='card-item'>
                                    <span className='stat-card'>
                                        {item.stat}
                                    </span>
                                    <span className='name-card'>
                                        {item.name}
                                    </span>
                                </div>
                            )
                        })}
                </section>
            </main>
        </>
    );
}

export default MainSectionHome;
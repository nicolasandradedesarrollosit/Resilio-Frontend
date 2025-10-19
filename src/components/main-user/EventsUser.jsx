import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/main-user/eventsUser.css';
import LoadingScreen from '../others/LoadingScreen';
import { UserContext } from '../context/UserContext';

function EventsUser() {
    const { events, loading } = useContext(UserContext);

    if (loading) {
        return <LoadingScreen message="Cargando eventos" subtitle="Descubriendo las mejores experiencias para ti" />;
    }

    return (
            <section className="events-container">
                <div className="events-header">
                    <Link to={'/user/events'} className="events-title-link"><h2 className="events-title">Eventos destacados</h2></Link>
                    <p className='subtitle-events'>Explora los eventos más relevantes para ti</p>
                </div>
                <div className='container-cards-events'>
                    {events.map(( event, index ) => (
                        <article key={event.id ?? index} className={`event-card`}>
                            <div className='container-event-image'>
                                <img src={event.image || '/logo-resilio-group.png'} alt={event.title || 'Evento'} />
                            </div>
                            <div className='container-event-content'>
                                <div className='container-event-text'>
                                    <h3 className='event-title'>{event.name}</h3>
                                    <p className='event-description'>{event.description}</p>
                                </div>
                                <div className='container-event-date'>
                                    <p className='event-date'>{event.date ? new Date(event.date).toLocaleDateString() : ''}</p>
                                    <p className='event-location'>{event.location}</p>
                                </div>
                            </div>
                            <div className='container-event-links'>
                                {event.url_passline ? (
                                    <a className='event-btn primary' href={event.url_passline} target="_blank" rel="noopener noreferrer">Comprar Ticket</a>
                                ) : null}
                                <Link className='event-btn' to={`/user/events/${event.id}`}>Ver más</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
    );
}

export default EventsUser;
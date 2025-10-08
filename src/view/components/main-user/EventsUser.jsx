import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/main-user/eventsUser.css';

function EventsUser() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
                if (!response.ok) {
                    console.error('Error fetching events');
                    return;
                }
                const result = await response.json();

                if (result.ok && result.data) {
                    setEvents(result.data);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    

    if (loading) {
        return (
            <section className="events-container">
                <h2 className="events-title">Eventos destacados</h2>
                <div className="loading-events">Cargando eventos...</div>
            </section>
        );
    }

    if (events.length === 0) {
        return (
            <section className="events-container">
                <h2 className="events-title">Eventos destacados</h2>
                <p className="subtitle-events">No hay eventos disponibles por el momento.</p>
            </section>
        );
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
                                <h3 className='event-title'>{event.title}</h3>
                                <p className='event-description'>{event.description}</p>
                            </div>
                            <div className='container-event-date'>
                                <p className='event-date'>{event.date ? new Date(event.date).toLocaleDateString() : ''}</p>
                                <p className='event-location'>{event.location}</p>
                            </div>
                        </div>
                        <div className='container-event-links'>
                            <Link className='event-btn' to={`/user/events/${event.id}`}>Ver más</Link>
                            {event.url ? (
                                <a className='event-btn primary' href={event.url} target="_blank" rel="noopener noreferrer">Comprar Ticket</a>
                            ) : null}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default EventsUser;
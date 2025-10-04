import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/main-user/eventsUser.css';

function EventsUser() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
                if (!response.ok) {
                    console.error('Error fetching events');
                    return;
                }
                const result = await response.json();
                console.log(result);
                
                if (result.ok && result.data) {
                    setEvents([...result.data, ...result.data]);
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
            <div className="events-container">
                <h2 className="events-title">Eventos destacados</h2>
                <div className="loading-events">Cargando eventos...</div>
            </div>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <div className="events-container">
            <Link to={'/user/events'}><h2 className="events-title">Eventos destacados</h2></Link>
            <div className="carousel-wrapper">
                <div className="infinite-carousel">
                    {events.map((item, index) => (
                        <Link key={index} to={`/events/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="event-card">
                                <div className="event-content">
                                    <h3 className="event-title">{item.title}</h3>
                                    <p className="event-description">{item.description}</p>
                                    <span className="event-date">{new Date(item.date).toLocaleDateString('es-ES', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventsUser;
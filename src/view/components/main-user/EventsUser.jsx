import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/main-user/eventsUser.css';

function EventsUser() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSliding, setIsSliding] = useState(false);

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

    useEffect(() => {
        if (events.length < 3) return;

        const interval = setInterval(() => {
            setIsSliding(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % events.length);
                setIsSliding(false);
            }, 800);
        }, 4000);

        return () => clearInterval(interval);
    }, [events.length]);

    const getVisibleEvents = () => {
        if (events.length === 0) return [];
        if (events.length === 1) return [{ event: events[0], position: 'center', index: 0 }];
        if (events.length === 2) return [
            { event: events[currentIndex], position: 'center', index: currentIndex },
            { event: events[(currentIndex + 1) % events.length], position: 'right', index: (currentIndex + 1) % events.length }
        ];

        return [
            { 
                event: events[(currentIndex - 1 + events.length) % events.length], 
                position: 'left',
                index: (currentIndex - 1 + events.length) % events.length
            },
            { 
                event: events[currentIndex], 
                position: 'center',
                index: currentIndex
            },
            { 
                event: events[(currentIndex + 1) % events.length], 
                position: 'right',
                index: (currentIndex + 1) % events.length
            }
        ];
    };

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

    const visibleEvents = getVisibleEvents();

    return (
        <div className="events-container">
            <Link to={'/user/events'}><h2 className="events-title">Eventos destacados</h2></Link>
            <div className="carousel-wrapper">
                <div className="infinite-carousel">
                    {visibleEvents.map(({ event, position, index }) => (
                        <Link 
                            key={`${event.id}-${position}`} 
                            to={`/events/${event.id}`} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div 
                                className="event-card" 
                                data-position={position}
                                data-sliding={isSliding}
                            >
                                <div className="event-content">
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-description">{event.description}</p>
                                    <span className="event-date">{new Date(event.date).toLocaleDateString('es-ES', { 
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
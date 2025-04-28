import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calendar.css';

function Calendar() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertPopup, setAlertPopup] = useState(null);

    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    useEffect(() => {
        if (!user) {
            axios.get('http://127.0.0.1:5000/api/profile', { withCredentials: true })
                .then(response => setUser(response.data))
                .catch(error => console.error('Error fetching user profile:', error));
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setLoading(true);

            const endpoint = user.role === "Organizer"
                ? "http://127.0.0.1:5000/api/organizer_calendar"
                : "http://127.0.0.1:5000/api/user_calendar";

            axios.get(endpoint, {
                withCredentials: true,
                params: {
                    month: currentMonth + 1,
                    year: currentYear,
                }
            })
            .then(response => {
                console.log("Fetched Events:", response.data);
                setEvents(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching calendar events:', error);
                setLoading(false);
            });
        }
    }, [user, currentMonth, currentYear]);

    if (!user) return <p>Loading profile...</p>;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const renderCalendar = () => {
        const calendarDays = [];

        for (let i = 0; i < firstDayIndex; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar__day empty"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.datetime);
                return eventDate.getUTCDate() === i &&
                       eventDate.getUTCMonth() === currentMonth &&
                       eventDate.getUTCFullYear() === currentYear;
            });

            const isToday =
                i === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

            calendarDays.push(
                <div 
                    key={i} 
                    className={`calendar__day ${isToday ? 'today' : ''}`}
                >
                    <span className="calendar__date">{i}</span>
                    {dayEvents.map(event => (
                        <div 
                            key={event.event_id}
                            className="calendar__task"
                            onClick={() => handleEventClick(event)}
                        >
                            <p className="font-semibold">{event.event_title}</p>
                            {event.alerts && event.alerts.length > 0 && (
                                <span 
                                    className="alert-icon"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent click from propagating to the event
                                        handleAlertClick(event.alerts);
                                    }}
                                >
                                    🔔
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return calendarDays;
    };

    const handleEventClick = (event) => {
        // Set the selected event for the popup to show its details
        setSelectedEvent(event);
    };

    const handleDayClick = (day) => {
        const eventOnDay = events.filter(event => {
            const eventDate = new Date(event.datetime);
            return eventDate.getUTCDate() === day &&
                   eventDate.getUTCMonth() === currentMonth &&
                   eventDate.getUTCFullYear() === currentYear;
        });

        if (eventOnDay.length > 0) {
            setSelectedEvent(eventOnDay[0]);
        }
    };

    const closeEventDetails = () => setSelectedEvent(null);

    const handleUnregister = () => {
        if (!selectedEvent) return;

        axios.delete('http://127.0.0.1:5000/api/unregister_event', {
            withCredentials: true,
            data: { event_id: selectedEvent.event_id }
        })
        .then(response => {
            setMessage(response.data.message);
            setSelectedEvent(null);
            setEvents(events.filter(event => event.event_id !== selectedEvent.event_id));
        })
        .catch(error => {
            console.error('Error unregistering from event:', error);
            setMessage("Failed to unregister from event");
        });
    };

    const formatTime = (datetime) => {
        if (!datetime) return 'N/A';
        const date = new Date(datetime);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            timeZone: 'UTC' 
        });
    };

    const handleAlertClick = (alerts) => {
        setAlertPopup(alerts);
    };

    const closeAlertPopup = () => {
        setAlertPopup(null);
    };

    return (
        <div className="calendar-contain">
            <div className="calendar__title-bar">
                <button onClick={handlePrevMonth}>&lt;</button>
                <div>{monthNames[currentMonth]} {currentYear}</div>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>

            <div className="calendar__sidebar">
                <h3 className="sidebar__heading">Upcoming Events</h3>
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading events...</p>
                ) : (
                    <ul className="sidebar__list">
                        {events.length > 0 ? (
                            [...events]
                                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                .map(event => {
                                    const eventDate = new Date(event.datetime);
                                    const isValidDate = !isNaN(eventDate);
                                    return (
                                        <li key={event.event_id || event.alert_id}
                                            className={`sidebar__list-item ${event.type === "alert" ? "alert" : ""}`}>
                                            <span>
                                                {event.type === "alert" ? "🔔 " : ""}
                                                {event.type === "alert" ? event.alert_title : event.event_title}
                                            </span>
                                            <span className="list-item__time">
                                                {isValidDate ? eventDate.toLocaleDateString() : "Invalid Date"}
                                            </span>
                                        </li>
                                    );
                                })
                        ) : (
                            <p className="text-gray-500 text-sm">
                                {user.role === "Organizer"
                                    ? "You haven’t created any upcoming events."
                                    : "You haven’t registered for any upcoming events."}
                            </p>
                        )}
                    </ul>
                )}
            </div>

            <div className="calendar__top-bar">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            <div className="calendar__week">
                {renderCalendar()}
            </div>

            {selectedEvent && (
                <div className="event-popup">
                    <div className="event-popup-content">
                        <h3>
                            {selectedEvent.type === "alert" ? selectedEvent.alert_title : selectedEvent.event_title}
                        </h3>
                        <p>{selectedEvent.event_description}</p>
                        <p><strong>Location:</strong> {selectedEvent.event_location}</p>
                        {selectedEvent.datetime && (
                            <>
                                <p><strong>Date:</strong> {new Date(selectedEvent.datetime).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {formatTime(selectedEvent.datetime)}</p>
                            </>
                        )}
                        {user.role === "Organizer" ? (
                            <button
                                onClick={() => {
                                    axios.delete(`http://127.0.0.1:5000/api/events/${selectedEvent.event_id}`, {
                                        withCredentials: true
                                    })
                                    .then(res => {
                                        setMessage(res.data.message);
                                        setEvents(prev => prev.filter(e => e.event_id !== selectedEvent.event_id));
                                        setSelectedEvent(null);
                                    })
                                    .catch(err => {
                                        console.error("Delete failed:", err);
                                        setMessage("Failed to delete event");
                                    });
                                }}
                            >
                                Delete Event
                            </button>
                        ) : (
                            <button onClick={handleUnregister}>Unregister</button>
                        )}
                        <button onClick={closeEventDetails}>Close</button>
                    </div>
                </div>
            )}

            {alertPopup && (
                <div className="popup">
                    <h3>Alerts</h3>
                    <ul>
                        {alertPopup.map(alert => (
                            <li key={alert.alert_id}>
                                <p><strong>{alert.alert_title}</strong></p>
                                <p>{alert.alert_description}</p>
                            </li>
                        ))}
                    </ul>
                    <button onClick={closeAlertPopup} className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-md">Close</button>
                </div>
            )}

            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Calendar;

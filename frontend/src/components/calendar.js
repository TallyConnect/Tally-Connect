import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calendar.css'; // ✅ Ensure this import is present

function Calendar() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState('');

    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    // Fetch user profile and events
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/profile', { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(error => console.error('Error fetching user profile:', error));
    }, []);

    useEffect(() => {
        if (user) {
            axios.get(`http://127.0.0.1:5000/api/registered_events?username=${user.user_name}`, { withCredentials: true })
                .then(response => setEvents(response.data))
                .catch(error => console.error('Error fetching registered events:', error));
        }
    }, [user]);

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
    const firstDayIndex = new Date(currentYear,currentMonth, 1).getDay();

    // Render calendar grid
    const renderCalendar = () => {
        const calendarDays = [];

        for (let i = 0; i < firstDayIndex; i++) {
            calendarDays.push(
                <div key={`empty-${i}`} className="calendar__day empty"></div>
            );
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.event_date);
                return eventDate.getDate() === i &&
                       eventDate.getMonth() === currentMonth &&
                       eventDate.getFullYear() === currentYear;
            });

            const isToday =
                i === today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear();

            calendarDays.push(
                <div key={i} className={`calendar__day ${isToday ? 'today' : ''}`}>
                    <span className="calendar__date">{i}</span>
                    <div className="calendar__task">
                        {dayEvents.map(event => (
                            <div key={event.event_id} className="calendar__task--today">
                                <p className="font-semibold">{event.event_title}</p>
                                <p className="text-sm text-gray-600">{event.event_time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return calendarDays;
    };

    return (
        <div className="calendar-contain">
            {/* Title Bar */}
            <div className="calendar__title-bar">
                <button onClick={handlePrevMonth}>&lt;</button>
                <div>
                    {monthNames[currentMonth]} {currentYear}
                </div>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>

            {/* Sidebar */}
            <div className="calendar__sidebar">
                <h3 className="sidebar__heading">Upcoming Events</h3>
                <ul className="sidebar__list">
                    {events.length > 0 ? (
                        events.map(event => (
                        <li key={event.event_id} className="sidebar__list-item">
                            <span>{event.event_title}</span>
                            <span className="list-item__time">
                                {new Date(event.event_date).toLocaleDateString()}
                            </span>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">You haven’t registered for any upcoming events.</p>
                )}
            </ul>
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

            {/* Optional message */}
            {message && <p>{message}</p>}
        </div>
    );
}

export default Calendar;

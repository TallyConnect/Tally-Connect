import React, { useEffect, useState } from "react";
import axios from "axios";

function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/events")
            .then(response => setEvents(response.data))
            .catch(error => console.error("Error fetching events:", error));
    }, []);

    return (
        <div>
            <h2>Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event.event_id}>{event.event_title} - {event.event_date}</li>
                ))}
            </ul>
        </div>
    );
}

export default Events;

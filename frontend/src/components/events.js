import React, { useEffect, useState } from "react";
import axios from "axios";

function Events() {
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/events")
            .then(response => setEvents(response.data))
            .catch(error => console.error("Error fetching events:", error));
    }, []);

    const handleSignup = async (eventId) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/api/signup_event",
                { event_id: eventId },
                { withCredentials: true }
            );
            setMessage(response.data.message);
        } catch (error) {
            console.error("Error signing up for event:", error);
            setMessage(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div>
            <h2>Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event.event_id}>
                        {event.event_title} - {event.event_date}
                        <button onClick={() => handleSignup(event.event_id)}>Sign Up</button>
                    </li>
                ))}
            </ul>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Events;

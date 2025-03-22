import React, { useState, useEffect } from "react";
import axios from "axios";

function Explore() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/events")
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error("Error fetching events:", error);
                setError("Failed to load events.");
            });
    }, []);

    const handleSignup = (eventId) => {
        axios.post("http://127.0.0.1:5000/api/signup_event", { event_id: eventId }, { withCredentials: true })
            .then(response => {
                alert(response.data.message || "Signed up successfully!");
            })
            .catch(error => {
                console.error("Signup error:", error);
                alert("Failed to sign up.");
            });
    };

    return (
        <div>
            <h2>Explore Events</h2>
            {error && <p>{error}</p>}
            <div className="grid-container">
                {events.map(event => (
                    <div key={event.event_id} className="grid-item">
                        <img
                            src={`http://127.0.0.1:5000${event.flyer_url}`}
                            alt={event.event_title}
                            className="flyer-image"
                        />
                        <h3>{event.event_title}</h3>
                        <p>{event.event_description}</p>
                        <p><strong>Location:</strong> {event.event_location}</p>
                        <p><strong>Date:</strong> {event.event_date}</p>
                        <p><strong>Time:</strong> {event.event_time}</p>
                        <button onClick={() => handleSignup(event.event_id)}>
                            Sign Up
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Explore;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Explore() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [popupEvent, setPopupEvent] = useState(null); // Store clicked event for popup

    // Fetch logged-in user's profile
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                setError("Failed to load user profile.");
            });
    }, []);

    // Fetch recommended events based on user's preferences or all events
    useEffect(() => {
        if (user) {
            const url = user.user_preferences
                ? `http://127.0.0.1:5000/api/recommended_events?user_name=${user.user_name}`
                : `http://127.0.0.1:5000/api/events`;

            axios.get(url, { withCredentials: true })
                .then(response => {
                    const data = response.data;
                    const recommended = data.recommended_events || data.events || [];
                    setEvents(recommended);
                })
                .catch(error => {
                    console.error("Error fetching events:", error);
                    setError("Failed to load events.");
                });
        }
    }, [user]);

    const handleSignup = (eventId) => {
        axios.post("http://127.0.0.1:5000/api/signup_event", { event_id: eventId }, { withCredentials: true })
            .then(response => {
                alert(response.data.message || "Signed up successfully!");
                setPopupEvent(null); // Close popup after sign-up
            })
            .catch(error => {
                console.error("Signup error:", error);
                alert("Failed to sign up.");
            });
    };

    const handleEventClick = (event) => {
        setPopupEvent(event); // Show event details in popup
    };

    const closePopup = () => {
        setPopupEvent(null); // Close the popup
    };

    return (
        <div>
            <h2>Recommended Events</h2>
            {error && <p>{error}</p>}

            <div className="grid-container">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.event_id} className="grid-item" onClick={() => handleEventClick(event)}>
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
                        </div>
                    ))
                ) : (
                    <p>No events available.</p>
                )}
            </div>

            {/* Popup for event details */}
            {popupEvent && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupContent}>
                        <h3>{popupEvent.event_title}</h3>
                        <img
                            src={`http://127.0.0.1:5000${popupEvent.flyer_url}`}
                            alt={popupEvent.event_title}
                            style={styles.flyerImage}
                        />
                        <p><strong>Description:</strong> {popupEvent.event_description}</p>
                        <p><strong>Location:</strong> {popupEvent.event_location}</p>
                        <p><strong>Date:</strong> {popupEvent.event_date}</p>
                        <p><strong>Time:</strong> {popupEvent.event_time}</p>
                        <button style={styles.button} onClick={() => handleSignup(popupEvent.event_id)}>Sign Up</button>
                        <button style={styles.button} onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    popupOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    popupContent: {
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center",
    },
    flyerImage: {
        maxWidth: "100%",
        height: "auto",
        borderRadius: "8px",
    },
    button: {
        padding: "10px",
        margin: "5px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
};

export default Explore;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Explore() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [popupEvent, setPopupEvent] = useState(null);

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
                setPopupEvent(null);
            })
            .catch(error => {
                console.error("Signup error:", error);
                alert("Failed to sign up.");
            });
    };

    const handleEventClick = (event) => {
        setPopupEvent(event);
    };

    const closePopup = () => {
        setPopupEvent(null);
    };

    return (
        <div className="main w-full p-4">
            <style>
                {`
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .grid-item {
                    background-color: #fff;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    text-align: center;
                    transition: transform 0.2s ease-in-out;
                }
                .grid-item:hover {
                    transform: scale(1.05);
                }
                .flyer-image {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-bottom: 2px solid #e0e0e0;
                }
                `}
            </style>

            <h2 className="text-2xl font-bold mb-4">Recommended Events</h2>
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
        overflowY: "auto", // Allow scrolling if content overflows
    },
    popupContent: {
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "90%", // Ensure the popup fits within the viewport
        maxHeight: "90%", // Limit the height to fit within the viewport
        width: "100%",
        textAlign: "center",
        overflowY: "auto", // Add scrolling for overflowing content
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
};

export default Explore;




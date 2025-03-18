import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then((response) => setUser(response.data))
            .catch((error) => console.error("Error fetching user:", error));
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/events")
            .then(response => {
                console.log("Fetched Events Data:", response.data);
                setEvents(response.data);
            })
            .catch(error => console.error("Error fetching events:", error));
    }, []);

    const filteredEvents = events.filter(event => 
        event?.event_title?.toLowerCase().includes((searchQuery || "").toLowerCase())
    );

    if (!user) return <p>Loading profile...</p>;

    const handleFlyerClick = (event) => {
        setSelectedEvent(event);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedEvent(null);
    };

    const handleRegister = () => {
        axios.post("http://127.0.0.1:5000/api/signup_event", { event_id: selectedEvent.event_id }, { withCredentials: true })
            .then(response => {
                alert(response.data.message);
                handleClosePopup();
            })
            .catch(error => {
                console.error("Registration error:", error);
                alert("Error registering for the event.");
            });
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
                .event-title {
                    font-weight: bold;
                    padding: 10px 0;
                }
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .popup {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
                    text-align: center;
                }

                .popup button {
                    margin-top: 10px;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    cursor: pointer;
                }

                .popup button:hover {
                    background-color: #45a049;
                }
                `}
            </style>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Events"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Event Flyers Grid */}
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="grid-container">
                {filteredEvents.map((event) => (
                    <div key={event.event_id} className="grid-item">
                        <img 
                            src={`http://127.0.0.1:5000${event.flyer_url}`} 
                            alt={event.event_title} 
                            className="flyer-image" 
                            onClick={() => handleFlyerClick(event)}
                        />
                        <h3 className="event-title">{event.event_title}</h3>
                    </div>
                ))}
            </div>

            {/* Popup Modal for Registration */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>{selectedEvent.event_title}</h2>
                        <p>{selectedEvent.event_description}</p>
                        <p>Location: {selectedEvent.event_location}</p>
                        <p>Date: {selectedEvent.event_date}</p>
                        <p>Time: {selectedEvent.event_time}</p>
                        <button onClick={handleRegister}>Register</button>
                        <button onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
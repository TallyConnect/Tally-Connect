import React, { useEffect, useState } from "react";
import axios from "axios";

function Events() {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [showEventDetailsPopup, setShowEventDetailsPopup] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventData, setEventData] = useState({
        event_title: "",
        event_date: "",
        event_location: "",
        event_time: "",
        event_description: "",
        selectedFile: null
    });
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(error => console.error("Error fetching user profile:", error));
    }, []);

    useEffect(() => {
        if (user) {
            axios.get(`http://127.0.0.1:5000/api/events?role=${user.role}&username=${user.user_name}`)
            .then(response => {
                console.log("Fetched events:", response.data);
                setEvents(response.data);
            })
            .catch(error => console.error("Error fetching events:", error));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => setEventData({ ...eventData, selectedFile: e.target.files[0] });

    const handleUpload = async () => {
        console.log(eventData); 

        if (!eventData.selectedFile || !eventData.event_title || !eventData.event_date || !eventData.event_location) {
            alert("Please fill in all fields and upload a flyer.");
            return;
        }

        const formData = new FormData();
        formData.append("file", eventData.selectedFile);
        formData.append("user_name", user.user_name);  // Organizer's username
        formData.append("event_title", eventData.event_title);  // Add relevant details
        formData.append("event_description", eventData.event_description);
        formData.append("event_location", eventData.event_location);
        formData.append("event_date", eventData.event_date);
        formData.append("event_time", eventData.event_time);

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/upload_flyer", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(response.data.message);
            setEvents((prevEvents) => [...prevEvents, {
                event_id: response.data.event_id,
                event_title: eventData.event_title,
                flyer_url: response.data.flyer_url,
            }]);
            setShowUploadPopup(true);
        } catch (error) {
            console.error("Error uploading flyer:", error);
            setMessage("Error uploading flyer. Please try again.");
        }
    };

    const handleEventClick = (eventId) => {
        axios.get(`http://127.0.0.1:5000/api/events/${eventId}`)
        .then(response => {
            setSelectedEvent(response.data);
            setShowEventDetailsPopup(true);
        })
        .catch(error => {
            console.error("Error fetching event details:", error);
            setMessage("Error fetching event details. Please try again.");
        });
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/api/events/${eventId}`);
            setMessage(response.data.message);
            setEvents(events.filter(event => event.event_id !== eventId));  // Remove event from the list
            setShowEventDetailsPopup(false);  // Close the popup
        } catch (error) {
            console.error("Error deleting event:", error);
            setMessage("Error deleting event. Please try again.");
        }
    };

    const handleUpdateEvent = async () => {
        const formData = new FormData();
        formData.append("event_title", eventData.event_title);
        formData.append("event_description", eventData.event_description);
        formData.append("event_location", eventData.event_location);
        formData.append("event_date", eventData.event_date);
        formData.append("event_time", eventData.event_time);
        if (eventData.selectedFile) {
            formData.append("file", eventData.selectedFile);
        }
    
        try {
            const response = await axios.put(`http://127.0.0.1:5000/api/events/${editingEvent.event_id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            setMessage(response.data.message);
            setEvents(prev =>
                prev.map(e => e.event_id === editingEvent.event_id ? { ...e, ...eventData } : e)
            );
            setShowEventDetailsPopup(false);
            setEditingEvent(null);
        } catch (error) {
            console.error("Update failed:", error);
            setMessage("Failed to update event.");
        }
    };
    

    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="p-4">
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
                .popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: white;
                    padding: 20px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }
                .popup img {
                    margin-top:10px;
                }
                `}
            </style>

            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            {message && <p className="text-green-600">{message}</p>}

            <div className="grid-container">
                {events.map(event => (
                    <div key={event.event_id} className="grid-item" onClick={() => handleEventClick(event.event_id)}>
                        <img 
                            src={`http://127.0.0.1:5000${event.flyer_url}`} 
                            alt={event.event_title} 
                            className="flyer-image" 
                        />
                        <h3 className="event-title">{event.event_title}</h3>
                    </div>
                ))}
            </div>

            {user.role.toLowerCase() === 'organizer' && (
                <div className="mt-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md"
                        onClick={() => setShowUploadPopup(true)}
                    >
                        Upload Event
                    </button>
                </div>
            )}

            {showUploadPopup && (
                <div className="popup">
                    <h3>Enter Event Details</h3>
                    <input
                        type="text"
                        name="event_title"
                        placeholder="Event Title"
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="event_date"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="event_location"
                        placeholder="Location"
                        onChange={handleChange}
                    />
                    <input
                        type="time"
                        name="event_time" 
                        onChange={handleChange}
                    />
                    <textarea
                        name="event_description"  
                        placeholder="Event Description"
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".png,.jpg,.jpeg,.gif"
                    />
                    <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md">Submit</button>
                    <button onClick={() => setShowUploadPopup(false)} className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md">Cancel</button>
                </div>
            )}

            {showEventDetailsPopup && selectedEvent && (
                <div className="popup">
                    <h3>{selectedEvent.event_title}</h3>
                    <img 
                        src={`http://127.0.0.1:5000${selectedEvent.flyer_url}`} 
                        alt={selectedEvent.event_title} 
                        className="flyer-image" 
                    />
                    <p><strong>Description:</strong> {selectedEvent.event_description}</p>
                    <p><strong>Location:</strong> {selectedEvent.event_location}</p>
                    <p><strong>Date:</strong> {selectedEvent.event_date}</p>
                    <p><strong>Time:</strong> {selectedEvent.event_time}</p>
                    {user.role.toLowerCase() === "organizer" && user.user_name === selectedEvent.user_name ? (
    <button
        onClick={() => handleDeleteEvent(selectedEvent.event_id)}
        className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md"
    >
        Delete Event
    </button>
) : null}
                    <button onClick={() => setShowEventDetailsPopup(false)} className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-md">Close</button>
                    {user.role.toLowerCase() === 'organizer' && user.user_name === selectedEvent.user_name && (
    <button onClick={() => {
        setEditingEvent(selectedEvent);
        setEventData({
            event_title: selectedEvent.event_title,
            event_description: selectedEvent.event_description,
            event_location: selectedEvent.event_location,
            event_date: selectedEvent.event_date,
            event_time: selectedEvent.event_time,
            selectedFile: null
        });
    }} className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded-md">Edit</button>
)}

{editingEvent && (
    <div className="popup">
        <h3>Edit Event</h3>
        <input
            type="text"
            name="event_title"
            placeholder="Event Title"
            value={eventData.event_title}
            onChange={handleChange}
        />
        <input
            type="date"
            name="event_date"
            value={eventData.event_date}
            onChange={handleChange}
        />
        <input
            type="text"
            name="event_location"
            placeholder="Location"
            value={eventData.event_location}
            onChange={handleChange}
        />
        <input
            type="time"
            name="event_time"
            value={eventData.event_time}
            onChange={handleChange}
        />
        <textarea
            name="event_description"
            placeholder="Event Description"
            value={eventData.event_description}
            onChange={handleChange}
        />
        <input
            type="file"
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.gif"
        />
        <button onClick={handleUpdateEvent} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md">Save Changes</button>
        <button onClick={() => setEditingEvent(null)} className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-md">Cancel</button>
    </div>
)}


                </div>
            )}
        </div>
    );
}

export default Events;
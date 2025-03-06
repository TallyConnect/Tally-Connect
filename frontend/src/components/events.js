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

    const handleUnregister = async (eventId) => {
        try {
            const response = await axios.delete("http://127.0.0.1:5000/api/unregister_event",
                { data: { event_id: eventId }, withCredentials: true }
            );
            setMessage(response.data.message);
        }
        catch (error) {
            console.error("Error unregistering for event:", error);
            setMessage(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            {message && <p className="text-green-600">{message}</p>}

            <div className="grid grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event.event_id} className="bg-white p-4 rounded-lg shadow-md">
                        {event.flyer_url && (
                            <img src={event.flyer_url} alt={event.event_title} className="h-40 w-full object-cover rounded-lg" />
                        )}
                        <h3 className="text-lg font-semibold mt-2">{event.event_title}</h3>
                        <p className="text-gray-600">{event.event_date}</p>

                        <div className="mt-2 flex gap-2">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                onClick={() => handleSignup(event.event_id)}>
                                Sign Up
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                                onClick={() => handleUnregister(event.event_id)}>
                                Unregister
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Events;

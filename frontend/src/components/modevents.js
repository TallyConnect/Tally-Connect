import React, { useEffect, useState } from "react";
import axios from "axios";

function ModeratorEvents() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    // Fetch all events on page load
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/moderator/events", { withCredentials: true })
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error("Error loading events:", error);
                setError("Failed to load events.");
            });
    }, []);

    // Approve event logic
    const handleApprove = (event_id) => {
        axios.post("http://127.0.0.1:5000/api/moderator/approve-event", { event_id }, { withCredentials: true })
            .then(() => {
                setEvents(prevEvents =>
                    prevEvents.map(event =>
                        event.event_id === event_id
                            ? { ...event, event_status: 'Scheduled', moderator_approval: 'Approved' }
                            : event
                    )
                );
            })
            .catch(error => {
                console.error("Approval failed:", error);
                alert("Error approving event");
            });
    };

    // Deny event logic
    const handleDeny = (event_id) => {
        axios.post("http://127.0.0.1:5000/api/moderator/deny-event", { event_id }, { withCredentials: true })
            .then(() => {
                setEvents(prevEvents =>
                    prevEvents.map(event =>
                        event.event_id === event_id
                            ? { ...event, event_status: 'Canceled', moderator_approval: 'Denied' }
                            : event
                    )
                );
            })
            .catch(error => {
                console.error("Denial failed:", error);
                alert("Error denying event");
            });
    };

    return (
        <div>
            <h2>Moderator Event Review</h2>
            {error && <p>{error}</p>}
            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <table border="1" cellPadding="8" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Organizer</th>
                            <th>Status</th>
                            <th>Approval</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.event_id}>
                                <td>{event.event_title}</td>
                                <td>{event.user_name}</td>
                                <td>{event.event_status}</td>
                                <td>{event.moderator_approval}</td>
                                <td>
                                    {(event.event_status === "Draft" && event.moderator_approval === "Pending") ? (
                                        <>
                                            <button onClick={() => handleApprove(event.event_id)}>Approve</button>
                                            <button onClick={() => handleDeny(event.event_id)} style={{ marginLeft: "10px", color: "red" }}>Deny</button>
                                        </>
                                    ) : (
                                        <span>✓</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ModeratorEvents;

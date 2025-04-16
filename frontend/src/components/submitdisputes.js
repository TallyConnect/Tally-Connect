// Frontend: SubmitDisputePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function SubmitDisputePage() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        event_id: "",
        moderator_id: "",
        dispute_summary: ""
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/my_events", { withCredentials: true })
            .then(response => setEvents(response.data))
            .catch(error => console.error("Error fetching events:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:5000/api/submit_dispute", formData, { withCredentials: true })
            .then(res => {
                setMessage(res.data.message);
                setFormData({ event_id: "", moderator_id: "", dispute_summary: "" });
            })
            .catch(error => {
                console.error("Error submitting dispute:", error);
                setMessage("Failed to submit dispute");
            });
    };

    return (
        <div className="admin-dashboard">
            <h2>Submit a Dispute</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Event:</label>
                <select name="event_id" value={formData.event_id} onChange={handleChange} required>
                    <option value="">-- Select Event --</option>
                    {events.map(event => (
                        <option key={event.event_id} value={event.event_id}>{event.event_title}</option>
                    ))}
                </select>

                <label>Assigned Moderator:</label>
                <input
                    type="text"
                    name="moderator_id"
                    placeholder="Moderator Username"
                    value={formData.moderator_id}
                    onChange={handleChange}
                    required
                />

                <label>Dispute Summary:</label>
                <textarea
                    name="dispute_summary"
                    rows={4}
                    placeholder="Describe your dispute here..."
                    value={formData.dispute_summary}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Submit Dispute</button>
            </form>
        </div>
    );
}

export default SubmitDisputePage;

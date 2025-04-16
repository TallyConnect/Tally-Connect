// Frontend: MyDisputesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function MyDisputesPage() {
    const [disputes, setDisputes] = useState([]);
    const [moderatorMessages, setModeratorMessages] = useState([]);
    const [eventTitles, setEventTitles] = useState({});

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/my_disputes", { withCredentials: true })
            .then(response => {
                setDisputes(response.data);
                const eventIds = [...new Set(response.data.map(d => d.event_id))];
                fetchEventTitles(eventIds);
            })
            .catch(err => console.error("Failed to fetch disputes", err));

        axios.get("http://127.0.0.1:5000/api/moderator_requests", { withCredentials: true })
            .then(response => {
                setModeratorMessages(response.data);
                const messageEventIds = [...new Set(response.data.map(m => m.event_id))];
                fetchEventTitles(messageEventIds);
            })
            .catch(err => console.error("Failed to fetch moderator messages", err));
    }, []);

    const fetchEventTitles = async (eventIds) => {
        const titles = {};
        for (const id of eventIds) {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/events/${id}`);
                titles[id] = res.data.event_title;
            } catch {
                titles[id] = id; // fallback to ID if title fetch fails
            }
        }
        setEventTitles(prev => ({ ...prev, ...titles }));
    };

    const groupedMessages = moderatorMessages.reduce((acc, msg) => {
        if (!acc[msg.event_id]) acc[msg.event_id] = [];
        acc[msg.event_id].push(msg);
        return acc;
    }, {});

    return (
        <div className="admin-dashboard">
            <h2>Messages from Moderator</h2>
            {moderatorMessages.length === 0 ? (
                <p>No messages from moderators.</p>
            ) : (
                <ul>
                    {Object.entries(groupedMessages).map(([eventId, messages]) => (
                        <li key={eventId}>
                            <strong>Event: {eventTitles[eventId] || eventId}</strong>
                            <ul>
                                {messages.map((msg, idx) => (
                                    <li key={idx}>
                                        <strong>{new Date(msg.created_at).toLocaleString()}:</strong> {msg.request_message}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}

            {disputes.length > 0 && (
                <>
                    <h2>My Disputes</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Dispute ID</th>
                                <th>Event</th>
                                <th>Moderator</th>
                                <th>Summary</th>
                                <th>Status</th>
                                <th>Resolution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disputes.map(dispute => (
                                <tr key={dispute.dispute_id}>
                                    <td>{dispute.dispute_id}</td>
                                    <td>{eventTitles[dispute.event_id] || dispute.event_id}</td>
                                    <td>{dispute.moderator_id}</td>
                                    <td>{dispute.dispute_summary}</td>
                                    <td>{dispute.dispute_status}</td>
                                    <td>{dispute.dispute_resolution || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default MyDisputesPage;

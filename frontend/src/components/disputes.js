import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

function Disputes() {
    const [disputes, setDisputes] = useState([]);
    const [administrator, setAdministrator] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [resolutionText, setResolutionText] = useState("");
    const [messageDispute, setMessageDispute] = useState(null);
    const [adminMessage, setAdminMessage] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then(response => {
                if (response.data.user_name) {
                    setAdministrator(response.data.user_name);
                }
            })
            .catch(error => console.error("Failed to fetch administrator profile", error));

        axios.get("http://127.0.0.1:5000/api/disputes", { withCredentials: true })
            .then(response => setDisputes(response.data))
            .catch(err => console.error("Failed to fetch disputes", err));
    }, []);

    const handleResolve = (dispute_id, status) => {
        axios.post(`http://127.0.0.1:5000/api/disputes/${dispute_id}/resolve`, {
            resolution: resolutionText,
            status: status
        }, { withCredentials: true })
        .then(() => {
            setDisputes(prev => prev.map(d =>
                d.dispute_id === dispute_id
                    ? { ...d, dispute_status: status, dispute_resolution: resolutionText }
                    : d
            ));
            setEditingId(null);
            setResolutionText("");
        })
        .catch(err => console.error("Failed to resolve dispute", err));
    };

    const handleSendMessage = (dispute) => {
        if (!adminMessage.trim()) {
            setConfirmationMessage("Message cannot be empty.");
            return;
        }

        axios.post("http://127.0.0.1:5000/api/admin_request", {
            dispute_id: dispute.dispute_id,
            event_id: dispute.event_id,
            admin_id: administrator,
            organizer_id: dispute.organizer_id,
            request_message: adminMessage
        }, { withCredentials: true })
        .then(() => {
            setConfirmationMessage("Message sent to organizer successfully.");
            setMessageDispute(null);
            setAdminMessage("");
        })
        .catch(err => {
            console.error("Failed to send message to organizer", err);
            setConfirmationMessage("Failed to send message.");
        });
    };

    return (
        <div className="admin-dashboard">
            <h2>Disputes Management</h2>
            {confirmationMessage && <p>{confirmationMessage}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Dispute ID</th>
                        <th>Event</th>
                        <th>Raised By</th>
                        <th>Summary</th>
                        <th>Status</th>
                        <th>Resolution</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {disputes.map(dispute => (
                        <tr key={dispute.dispute_id}>
                            <td>{dispute.dispute_id}</td>
                            <td>{dispute.event_id}</td>
                            <td>{dispute.raised_by}</td>
                            <td>{dispute.dispute_summary}</td>
                            <td>{dispute.dispute_status}</td>
                            <td>
                                {dispute.dispute_resolution || (editingId === dispute.dispute_id ? (
                                    <textarea
                                        value={resolutionText}
                                        onChange={(e) => setResolutionText(e.target.value)}
                                        rows={2}
                                        cols={30}
                                    />
                                ) : "—")}
                            </td>
                            <td>
                                {dispute.dispute_status !== "RESOLVED" && (
                                    editingId === dispute.dispute_id ? (
                                        <>
                                            <button onClick={() => handleResolve(dispute.dispute_id, "RESOLVED")}>Mark Resolved</button>
                                            <button onClick={() => handleResolve(dispute.dispute_id, "PENDING")}>Keep Pending</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditingId(dispute.dispute_id)}>Write Resolution</button>
                                            <button onClick={() => setMessageDispute(dispute)}>Message Organizer</button>
                                        </>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {messageDispute && (
                <div className="modal">
                    <h3>Message Organizer</h3>
                    <p>
                        <strong>Administrator {administrator}</strong> wants to message the organizer about event <strong>{messageDispute.event_id}</strong>.
                    </p>
                    <textarea
                        value={adminMessage}
                        onChange={(e) => setAdminMessage(e.target.value)}
                        rows={4}
                        placeholder="Enter your message to the organizer"
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <div>
                        <button onClick={() => handleSendMessage(messageDispute)}>Send</button>
                        <button onClick={() => setMessageDispute(null)} style={{ marginLeft: "10px" }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Disputes;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

function Analytics() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/analytics", { withCredentials: true })
            .then(response => setData(response.data))
            .catch(err => {
                console.error("Error fetching analytics:", err);
                setError("Failed to load analytics data.");
            });
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Organizer Event Analytics</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {data.map((org, index) => (
                <div key={index} style={{ marginBottom: "40px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}>
                    <h3>Organizer: {org.organizer}</h3>
                    <p><strong>Total Attendees:</strong> {org.total_attendees}</p>
                    <p><strong>Average Rating Across Events:</strong> {org.avg_rating_overall ? org.avg_rating_overall.toFixed(2) : "—"}</p>

                    <h4>Events</h4>
<ul>
  {org.events.map((event, idx) => (
    <li key={idx}>{event.event_title}</li>
  ))}
</ul>


                    {/* Feedback Section */}
                    <h4 style={{ marginTop: "20px" }}>Feedback</h4>
                    {org.events.map((event, idx) => (
                        <div key={idx} style={{ marginBottom: "20px" }}>
                            <h5>{event.event_title}</h5>
                            {event.feedbacks && event.feedbacks.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Rating</th>
                                            <th>Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {event.feedbacks.map((fb, i) => (
                                            <tr key={i}>
                                                <td>{fb.feedback_user || "—"}</td>
                                                <td>{fb.feedback_rating || "—"}</td>
                                                <td>{fb.feedback_comments || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: "#555" }}>No feedback submitted for this event yet.</p>
                            )}
                        </div>
                    ))}

                    {/* Disputes Section */}
                    {org.disputes.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "20px" }}>Disputes</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Dispute ID</th>
                                        <th>Summary</th>
                                        <th>Status</th>
                                        <th>Resolution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {org.disputes.map((dispute, i) => (
                                        <tr key={i}>
                                            <td>{dispute.dispute_id}</td>
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
            ))}
        </div>
    );
}

export default Analytics;

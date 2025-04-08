import React, { useEffect, useState } from "react";
import axios from "axios";

function Feedback() {
    const [feedback, setFeedback] = useState(null);
    const [message, setMessage] = useState("");
    const [newFeedback, setNewFeedback] = useState({ rating: "", comments: "", event_id: null });

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/feedback", { withCredentials: true })
            .then(response => setFeedback(response.data))
            .catch(error => console.error("Error fetching feedback:", error));
    }, []);

    const handleInputChange = (e) => {
        setNewFeedback({ ...newFeedback, [e.target.name]: e.target.value });
    };

    const handleLeaveFeedback = (event_id) => {
        setNewFeedback({ ...newFeedback, event_id });
    };

    const handleSubmitFeedback = () => {
        axios.post("http://127.0.0.1:5000/api/feedback", {
            event_id: newFeedback.event_id,
            feedback_rating: newFeedback.rating,
            feedback_comments: newFeedback.comments
        }, { withCredentials: true })
        .then(res => {
            setMessage(res.data.message);
            setFeedback(prev => ({
                ...prev,
                pending_feedback: prev.pending_feedback.filter(e => e.event_id !== newFeedback.event_id)
            }));
            setNewFeedback({ rating: "", comments: "", event_id: null });
        })
        .catch(error => console.error("Error submitting feedback:", error));
    };

    if (!feedback) return <p>Loading...</p>;

    const isOrganizerView = Array.isArray(feedback) && feedback.length > 0 && feedback[0].hasOwnProperty("attendee_count");

    // ✅ Fixed: Calculate total attendees using unique event_id
    const totalAttendees = isOrganizerView
        ? Array.from(new Map(feedback.map(item => [item.event_id, item.attendee_count])).values())
            .reduce((sum, count) => sum + count, 0)
        : 0;

    return (
        <div className="admin-dashboard">
            <h2>Feedback</h2>
            {message && <p>{message}</p>}

            {isOrganizerView ? (
                <>
                    <p><strong>Total Attendees Across Your Events:</strong> {totalAttendees}</p>
                    <h3>Event Feedback Summary</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>User</th>
                                <th>Rating</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.map((fb, idx) => (
                                <tr key={idx}>
                                    <td>{fb.event_title}</td>
                                    <td>{fb.feedback_user || "—"}</td>
                                    <td>{fb.feedback_rating || "—"}</td>
                                    <td>{fb.feedback_comments || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    {feedback.pending_feedback.length > 0 && (
                        <>
                            <h3>Pending Feedback</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedback.pending_feedback.map(event => (
                                        <tr key={event.event_id}>
                                            <td>{event.event_title}</td>
                                            <td>
                                                <button onClick={() => handleLeaveFeedback(event.event_id)}>Leave Feedback</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {feedback.pending_feedback.length === 0 && feedback.attended.length === 0 && (
                        <p>No events attended! <a href="/explore">Explore Events</a></p>
                    )}

                    {newFeedback.event_id && (
                        <div>
                            <h3>Submit Feedback</h3>
                            <input
                                type="number"
                                name="rating"
                                placeholder="Rating (1-5)"
                                value={newFeedback.rating}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="comments"
                                placeholder="Your comments"
                                value={newFeedback.comments}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleSubmitFeedback}>Submit</button>
                        </div>
                    )}

                    {feedback.attended.length > 0 && (
                        <>
                            <h3>Attended Events</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Rating</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedback.attended.map((fb, idx) => (
                                        <tr key={idx}>
                                            <td>{fb.event_title}</td>
                                            <td>{fb.feedback_rating}</td>
                                            <td>{fb.feedback_comments}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Feedback;

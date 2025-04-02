import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

function WarningsPage() {
    const [warnings, setWarnings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/admin/warnings", { withCredentials: true })
            .then(response => setWarnings(response.data))
            .catch(error => {
                console.error("Error loading warnings:", error);
                setError("Failed to load warnings.");
            });
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Warnings Log</h2>
            {error && <p>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Issued By</th>
                        <th>Date</th>
                        <th>Resolved</th>
                    </tr>
                </thead>
                <tbody>
                    {warnings.map(w => (
                        <tr key={w.warning_id}>
                            <td>{w.user_name}</td>
                            <td>{w.warning_reason}</td>
                            <td>{w.warning_status}</td>
                            <td>{w.warning_issued_by}</td>
                            <td>{new Date(w.warning_date_issued).toLocaleString()}</td>
                            <td>{w.warning_resolution ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export default WarningsPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [warningReason, setWarningReason] = useState("");
    const [warningStatus, setWarningStatus] = useState("yellow");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/admin/users", { withCredentials: true })
            .then(response => {
                console.log("Admin User Data:", response.data);
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setError("Failed to load users.");
            });
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleStatusChange = (username, action) => {
        const endpoint = `http://127.0.0.1:5000/api/admin/users/${username}/${action}`;
        axios.post(endpoint, {}, { withCredentials: true })
            .then(() => {
                setUsers(prev =>
                    prev.map(user =>
                        user.user_name === username
                            ? { ...user, user_status: action === "activate" ? "Active" : "Suspended" }
                            : user
                    )
                );
            })
            .catch(err => {
                console.error(`Error trying to ${action} ${username}:`, err);
            });
    };

    const openWarningModal = (user) => {
        setSelectedUser(user);
        setWarningReason("");
        setWarningStatus("yellow");
        setShowModal(true);
    };

    const sendWarning = () => {
        if (!selectedUser) return;
        axios.post(`http://127.0.0.1:5000/api/admin/users/${selectedUser.user_name}/warn`, {
            warning_reason: warningReason,
            warning_status: warningStatus,
        }, { withCredentials: true })
            .then(() => {
                alert("Warning sent successfully");
                setShowModal(false);
            })
            .catch(err => {
                console.error("Failed to send warning:", err);
                alert("Failed to send warning.");
            });
    };

    const filteredUsers = users.filter(user =>
        user.user_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {error && <p>{error}</p>}
            
            <input 
                type="text" 
                placeholder="Search users..." 
                value={search} 
                onChange={handleSearch}
            />

            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.user_name}>
                            <td>{user.user_name}</td>
                            <td>{user.user_email}</td>
                            <td>{user.role}</td>
                            <td>{user.user_status}</td>
                            <td>
                                <button onClick={() => handleStatusChange(user.user_name, "activate")}>Activate</button>
                                <button onClick={() => handleStatusChange(user.user_name, "deactivate")}>Deactivate</button>
                                <button onClick={() => openWarningModal(user)}>Warn</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => navigate("/profile")}>Go to Profile</button>

            {showModal && (
                <div className="modal" style={modalStyle}>
                    <h3>Issue Warning to {selectedUser.user_name}</h3>
                    <textarea
                        value={warningReason}
                        onChange={(e) => setWarningReason(e.target.value)}
                        placeholder="Enter warning reason"
                        rows={4}
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <select value={warningStatus} onChange={(e) => setWarningStatus(e.target.value)}>
                        <option value="yellow">Yellow</option>
                        <option value="red">Red</option>
                        <option value="black">Black</option>
                    </select>
                    <div style={{ marginTop: "10px" }}>
                        <button onClick={sendWarning}>Submit</button>
                        <button onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalStyle = {
    position: "fixed",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -30%)",
    backgroundColor: "#fff",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
    width: "400px"
};

export default AdminDashboard;

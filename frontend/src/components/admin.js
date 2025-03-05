import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/admin/users", { withCredentials: true })
            .then(response => {
                console.log("Admin User Data:", response.data);  // ✅ Debugging
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
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.user_name}>
                            <td>{user.user_name}</td>
                            <td>{user.user_email}</td>
                            <td>{user.role}</td>
                            <td>{user.user_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => navigate("/profile")}>Go to Profile</button>
        </div>
    );
}

export default AdminDashboard;

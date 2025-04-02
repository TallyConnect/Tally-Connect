import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css"; // Reuse the existing admin dashboard styles

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        user_email: "",
        user_password: "",
        user_contact_details: "",
        user_preferences: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then(response => {
                setUser(response.data);
                setForm({
                    user_email: response.data.user_email,
                    user_password: response.data.user_password,
                    user_contact_details: response.data.user_contact_details || "",
                    user_preferences: response.data.user_preferences || ""
                });
            })
            .catch(() => setError("Failed to load profile."));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        axios.post("http://127.0.0.1:5000/api/profile/update", form, { withCredentials: true })
            .then(response => {
                setUser(response.data.user);
                setEditing(false);
            })
            .catch(() => setError("Update failed."));
    };

    const handleSignOut = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/api/logout", {}, { withCredentials: true });
            sessionStorage.removeItem("user");
            localStorage.removeItem("user");
            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate("/");
        } catch {
            alert("Logout failed.");
        }
    };

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="admin-dashboard">
            <h2>Welcome, {user.user_name}!</h2>
            <p>Role: {user.role}</p>
            <p>Status: {user.user_status}</p>

            {editing ? (
                <>
                    <input name="user_email" value={form.user_email} onChange={handleChange} placeholder="Email" />
                    <input name="user_password" value={form.user_password} onChange={handleChange} placeholder="Password" />
                    <input name="user_contact_details" value={form.user_contact_details} onChange={handleChange} placeholder="Contact Details" />
                    <input name="user_preferences" value={form.user_preferences} onChange={handleChange} placeholder="Preferences" />
                    <div style={{ marginTop: "10px" }}>
                        <button onClick={handleUpdate}>Save</button>
                        <button onClick={() => setEditing(false)} style={{ marginLeft: "10px" }}>Cancel</button>
                    </div>
                </>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Preferences</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user.user_email}</td>
                            <td>{user.user_contact_details}</td>
                            <td>{user.user_preferences}</td>
                        </tr>
                    </tbody>
                </table>
            )}

            {!editing && (
                <button onClick={() => setEditing(true)} style={{ marginTop: "20px" }}>Edit Profile</button>
            )}

            <div style={{ marginTop: "20px" }}>
                <button onClick={handleSignOut} style={{ padding: "10px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default Profile;

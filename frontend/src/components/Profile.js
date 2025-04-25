import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

function PreferenceDropdown({ categories, selectedPrefs, onChange }) {
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCheckboxChange = (category) => {
        const updated = selectedPrefs.includes(category)
            ? selectedPrefs.filter(item => item !== category)
            : [...selectedPrefs, category];
        onChange(updated.join(", "));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: "relative", width: "200px" }}>
            <div
                onClick={toggleDropdown}
                style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    cursor: "pointer",
                    background: "#f9f9f9"
                }}
            >
                {selectedPrefs.length > 0 ? selectedPrefs.join(", ") : "Select Preferences"}
            </div>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        zIndex: 1,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        maxHeight: "150px",
                        overflowY: "auto",
                        width: "100%"
                    }}
                >
                    {categories.length > 0 ? (
                        categories.map((cat, idx) => (
                            <label key={idx} style={{ display: "block", padding: "5px" }}>
                                <input
                                    type="checkbox"
                                    checked={selectedPrefs.includes(cat.name)}
                                    onChange={() => handleCheckboxChange(cat.name)}
                                />
                                {cat.name}
                            </label>
                        ))
                    ) : (
                        <p style={{ padding: "5px" }}>No categories</p>
                    )}
                </div>
            )}
        </div>
    );
}

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
    const [categories, setCategories] = useState([]);
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

        axios.get("http://127.0.0.1:5000/api/categories")
            .then(res => setCategories(res.data.categories || []))
            .catch(() => console.error("Failed to load categories."));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        const updatedForm = {
            ...form,
            user_password: form.user_password || user.user_password,
        };

        axios.post("http://127.0.0.1:5000/api/profile/update", updatedForm, { withCredentials: true })
            .then(response => {
                setUser(response.data.user);
                setEditing(false);
            })
            .catch(err => {
                setError("Update failed.");
            });
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
                    <PreferenceDropdown
                        categories={categories}
                        selectedPrefs={form.user_preferences.split(',').map(p => p.trim())}
                        onChange={(val) => setForm({ ...form, user_preferences: val })}
                    />
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

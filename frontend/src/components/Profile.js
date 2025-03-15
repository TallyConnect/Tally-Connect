import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then(response => {
                console.log("Profile Data:", response.data);  // ✅ Debugging
                setUser(response.data);
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
                setError("Failed to load profile.");
            });
    }, []);

    const handleSignOut = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/api/logout", {}, { withCredentials: true });

            sessionStorage.removeItem("user");
            localStorage.removeItem("user");
            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            console.log("Logout successful");

            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Failed to logout. Please try again.");
        }
    };

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading profile...</p>;

    return (
        <div>
            <h2>Welcome, {user.user_name}</h2>
            <p>Email: {user.user_email}</p>
            <p>Role: {user.role}</p>  
            <p>Status: {user.user_status}</p>

            {/* Sign out button */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleSignOut}
                    style={{ padding: "10px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default Profile;

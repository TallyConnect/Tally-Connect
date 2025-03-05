import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

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

    const openEventsWindow = () => {
        window.open("/events", "_blank");
    };

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading profile...</p>;

    return (
        <div>
            <h2>Welcome, {user.user_name}</h2>
            <p>Email: {user.user_email}</p>
            <p>Role: {user.role}</p>  
            <p>Status: {user.user_status}</p>

            {/* Profile information and the button to open events in a new window */}
            <div>
                <button onClick={openEventsWindow}>Open Events in New Window</button>
            </div>
        </div>
    );
}

export default Profile;

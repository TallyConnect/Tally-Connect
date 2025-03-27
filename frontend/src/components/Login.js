import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // ✅ New CSS file for styles
import bgVideo from "../assets/login.mp4"; 

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("User");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Logging in with:", username, password, role);

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/login", {
                username,
                password,
                role,
            }, { withCredentials: true });

            console.log("Login Response:", response.data);

            if (response.status === 200) {
                localStorage.setItem("user", JSON.stringify(response.data.user));

                switch (role) {
                    case "Administrator":
                        navigate("/admin");
                        break;
                    case "Moderator":
                    case "Organizer":
                        navigate("/home");
                        break;
                    default:
                        navigate("/home");
                        break;
                }
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);  // Show specific error
            } else {
                setError("Login failed. Please try again.");
            }
        }
        
    };

    return (
        <div className="login-page">
            {/* 🔁 Background video */}
            <video className="bg-video" autoPlay loop muted>
                <source src={bgVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* 🔳 Overlay */}
            <div className="overlay"></div>

            {/* 🔳 Login Box */}
            <div className="login-container">
                <h1 className="title">Tally Connect</h1>
                <h2 className="subtitle">Login</h2>

                <form onSubmit={handleLogin}>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Organizer">Organizer</option>
                        <option value="Administrator">Administrator</option>
                    </select>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>

                {error && <p className="error">{error}</p>}

                <p className="signup-text">
                    Don't have an account? <button onClick={() => navigate("/signup")}>Sign Up</button>
                </p>
            </div>
        </div>
    );
}

export default Login;
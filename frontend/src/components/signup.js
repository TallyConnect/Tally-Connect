import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // ✅ CSS file for background styling
import bgVideo from "../assets/login.mp4"; // ✅ Reuse the same video

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("User");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/signup", {
                username,
                email,
                password,
                role,
            });

            if (response.status === 201) {
                alert("Sign-up successful! You can now log in.");
                navigate("/");
            }
        } catch (err) {
            console.error("Signup Error:", err.response ? err.response.data : err);
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="signup-page">
            <video className="bg-video" autoPlay loop muted>
                <source src={bgVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="overlay"></div>

            <div className="signup-container">
                <h1 className="title">Tally Connect</h1>
                <h2 className="subtitle">Sign Up</h2>

                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Organizer">Organizer</option>
                        <option value="Administrator">Administrator</option>
                    </select>
                    <button type="submit">Sign Up</button>
                </form>

                {error && <p className="error">{error}</p>}

                <p className="login-link">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")}>Login</button>
                </p>
            </div>
        </div>
    );
}

export default Signup;

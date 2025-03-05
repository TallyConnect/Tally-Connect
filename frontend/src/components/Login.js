import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("User");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Logging in with:", username, password,role);
        
        try {
            const response = await axios.post("http://127.0.0.1:5000/api/login", {
                username,
                password,
                role,
            }, { withCredentials: true });

            console.log("Login Response:", response.data);  // ✅ Debugging output

            if (response.status === 200) {
                localStorage.setItem("user", JSON.stringify(response.data.user));  // ✅ Store user data
                navigate("/profile");  // ✅ Redirect to profile page
            }
        } catch (err) {
            console.error("Login Error:", err.response ? err.response.data : err);  // ✅ Debugging
            setError("Invalid login credentials");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Organizer">Organizer</option>
                </select>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;

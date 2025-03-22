import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then((response) => {
                const userRole = response.data.role.toLowerCase();
                setRole(userRole);
                localStorage.setItem("user", JSON.stringify(response.data));
                setIsAuthenticated(true);
            })
            .catch((error) => {
                console.error("Profile error:", error);
                setIsAuthenticated(false);
            });
        
        axios.get("http://127.0.0.1:5000/api/events")
            .then(response => setEvents(response.data))
            .catch(error => console.error("Error fetching events:", error));
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/api/logout", {}, { withCredentials: true });

            sessionStorage.removeItem("user");
            localStorage.removeItem("user");

            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            console.log("Logout successful");

            setIsAuthenticated(false);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Failed to logout. Please try again.");
        }
    };

    const menuOptions = {
        user: [
            { name: "Home", path: "/home", icon: "fa-home" },
            { name: "Profile", path: "/profile", icon: "fa-user" },
            { name: "Calendar", path: "/calendar", icon: "fa-calendar" },
            { name: "Feedback/Reviews", path: "/feedback", icon: "fa-comments" },
            { name: "Explore", path: "/explore", icon: "fa-search" }
        ],
        admin: [
            { name: "Home", path: "/home", icon: "fa-home" },
            { name: "Profile", path: "/profile", icon: "fa-user" },
            { name: "Users", path: "/users", icon: "fa-users" },
            { name: "Events Listings", path: "/events", icon: "fa-calendar-check" },
            { name: "Analytics", path: "/analysis", icon: "fa-chart-bar" },
            { name: "Disputes", path: "/disputes", icon: "fa-exclamation-circle" }
        ],
        organizer: [
            { name: "Home", path: "/home", icon: "fa-home" },
            { name: "Profile", path: "/profile", icon: "fa-user" },
            { name: "Events Listings", path: "/events", icon: "fa-calendar-check" },
            { name: "Calendar", path: "/calendar", icon: "fa-calendar" },
            { name: "Feedback/Reviews", path: "/feedback", icon: "fa-comments" },
            { name: "Analytics", path: "/analysis", icon: "fa-chart-bar" }
        ],
        moderator: [
            { name: "Home", path: "/home", icon: "fa-home" },
            { name: "Profile", path: "/profile", icon: "fa-user" },
            { name: "Events Listings", path: "/moderator/events", icon: "fa-calendar-check" },
            { name: "Disputes", path: "/disputes", icon: "fa-exclamation-circle" },
            { name: "Engagement", path: "/engagement", icon: "fa-handshake" }
        ]
    };

    return (
        <div className="flex">
            <style>
                {`
                    /* Sidebar styles */
                    .sidebar {
                        height: 100vh;
                        width: 220px;
                        position: fixed;
                        top: 0;
                        left: 0;
                        background-color: #111;
                        padding-top: 16px;
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                    }

                    /* Style sidebar links */
                    .sidebar a {
                        padding: 12px 20px;
                        text-decoration: none;
                        font-size: 18px;
                        color:#818181;
                        display: flex;
                        align-items: center;
                        width: 100%;
                        gap: 12px;
                        transition: 0.3s;
                        cursor: pointer;
                    }

                    /* Active link styling */
                    .sidebar a.active {
                        background-color: #333;
                        color: #f1f1f1;
                    }

                    /* Style links on mouse-over */
                    .sidebar a:hover {
                        color:#f1f1f1;
                    }

                    /* Style the main content */
                    .main {
                        margin-left: 220px; 
                        padding: 10px;
                        width: 100%;
                    }

                    .logout-btn {
                        margin-top: auto;
                        width: 100%;
                        padding: 12px 20px;
                        background-color: #d9534f;
                        color: white;
                        border: none;
                        text-align: left;
                        cursor: pointer;
                    }

                    .logout-btn:hover {
                        background-color: #c9302c;
                    }
                `}
            </style>

            {isAuthenticated && (
                <div className="sidebar">
                    {(menuOptions[role] || menuOptions['user'])?.map((option) => (
                        <a 
                            key={option.path}
                            className={location.pathname === option.path ? "active" : ""}
                            onClick={() => navigate(option.path)}
                        >
                            <i className={`fa fa-fw ${option.icon}`}></i>
                            {option.name}
                        </a>     
                    ))}

                    {/* Logout button */}
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fa fa-fw fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            )}

            <div className="main">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;

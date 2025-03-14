import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then((response) => setUser(response.data))
            .catch((error) => console.error("Error fetching user:", error));
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/events")
            .then(response => {
                console.log("Fetched Events Data:", response.data);
                setEvents(response.data);
            })
            .catch(error => console.error("Error fetching events:", error));
    }, []);

    const filteredEvents = events.filter(event => 
        event?.event_title?.toLowerCase().includes((searchQuery || "").toLowerCase())
    );

    if (!user) return <p>Loading profile ...</p>;

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
            { name: "Events Listings", path: "/events", icon: "fa-calendar-check" },
            { name: "Disputes", path: "/disputes", icon: "fa-exclamation-circle" },
            { name: "Engagement", path: "/engagement", icon: "fa-handshake" }
        ]
    };

    return (
        <div className="flex h-screen">
            <style>
                {`
                    :root {
                        --card_width: 250px;
                        --row_increment: 10px;
                        --card_border_radius: 16px;
                        --card_small: 26;
                        --card_med: 33;
                        --card_large: 45;
                    }

                    /* Pin container setup */
                    .pin-container {
                        margin: 0;
                        padding: 0;
                        width: 80vw;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        display: grid;
                        grid-template-columns: repeat(auto-fill, var(--card_width));
                        grid-auto-rows: var(--row_increment);
                        justify-content: center;
                        background-color: black;
                    }
                
                    /* Individual pin setup */
                    .card {
                        padding: 0;
                        margin: 15px 10px;
                        border-radius: var(--card_border_radius);
                        background-color: red;
                        overflow: hidden; /* To ensure the image doesn't overflow the card */
                    }   
                
                    /* Medium card size */
                    .card_medium {
                        grid-row: span var(--card_med);
                        grid-column: span var(--card_med);
                    }

                    /* Ensure the images fit within card and maintain aspect ratio */
                    .card img {
                        width: 100%;
                        height: auto;
                        border-radius: inherit;
                    }
                    
                    /* Main content padding adjustment for sidebar */
                    .main {
                        margin-left: 160px;
                        padding: 0px 10px;}
                `}
            </style>

            {/* Left Sidebar */}
            <div className="sidebar">
                <h3 className="text-xl font-bold mb-4 text-white pl-6">Menu</h3>
                {menuOptions[user.role.toLowerCase()]?.map((option) => (
                    <button key={option.path} onClick={() => navigate(option.path)}>
                        <i className={`fa fa-fw ${option.icon}`}></i>{option.name}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="main w-full p-4">
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search Events"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Event Flyers Grid */}
                <div className="pin-container">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className={`card card_medium`}>
                            <img src={event.flyer_url} alt={event.title} className="h-full w-full object-cover rounded-lg"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
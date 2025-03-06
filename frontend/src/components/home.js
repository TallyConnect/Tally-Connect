import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/events")
        .then((response) => setEvents(response.data))
        .catch((error) => console.error("Error fetching events:", error));
    }, []);

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <button onClick={() => navigate("/home")}>Home</button>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/calendar")}>Calendar</button>
                <button onClick={() => navigate("/explore")}>Explore</button>
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
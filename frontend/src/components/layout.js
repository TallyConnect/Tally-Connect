import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();

    return (
        <div className="flex">
            <style>
                {`
                    /* Sidebar styles */
                    .sidebar {
                        height: 100%;
                        width: 160px;
                        position: fixed;
                        z-index: 1;
                        top: 0;
                        left: 0;
                        background-color: #111;
                        overflow-x: hidden;
                        padding-top: 16px;
                    }

                    /* Style sidebar links */
                    .sidebar a {
                        padding: 6px 8px 6px 16px;
                        text-decoration: none;
                        font-size: 20px;
                        color:#818181;
                        display: block;
                    }

                    /* Style links on mouse-over */
                    .sidebar a:hover {
                        color:#f1f1f1;
                    }

                    /* Style the main content */
                    .main {
                        margin-left: 160px; /* Same as the width of the sidenav */
                        padding: 0px 10px;
                    }

                    /* Add media queries for small screens */
                    @media screen and (max-height: 450px) {
                        .sidebar { padding-top: 15px; }
                        .sidebar a { font-size: 18px; }
                    }
                `}
            </style>

            {/* Left Sidebar */}
            <div className="sidebar">
                <a onClick={() => navigate("/home")}><i className="fa fa-fw fa-home"></i> Home</a>
                <a onClick={() => navigate("/profile")}><i className="fa fa-fw fa-user"></i> Profile</a>
                <a onClick={() => navigate("/events")}><i className="fa fa-fw fa-calendar"></i> Events</a>
                <a onClick={() => navigate("/calendar")}><i className="fa fa-fw fa-calendar"></i> Calendar</a>
                <a onClick={() => navigate("/explore")}><i className="fa fa-fw fa-search"></i> Explore</a>
            </div>

            {/* Main content */}
            <div className="main">
                <Outlet /> {/* This is where the child routes will be rendered */}
            </div>
        </div>
    );
}

export default Layout;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Events from "./components/events";   

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/events" element={<Events />} /> {/*Add the route for Events*/}
            </Routes>
        </Router>
    );
}

export default App;

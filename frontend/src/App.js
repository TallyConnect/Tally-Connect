import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/signup";
import Profile from "./components/Profile";
import Events from "./components/events";   
import AdminDashboard from "./components/admin";  // ✅ Import Admin Page
import Home from "./components/home";  // ✅ Import Home Page
import Layout from "./components/layout";  // ✅ Import Layout

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}> 
                    <Route path="/" element={<Login />} />  
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/events" element={<Events />} /> {/*Add the route for Events*/}
                    <Route path="/admin" element={<AdminDashboard />} />  {/* ✅ New Route for Admin */}
                    <Route path="/home" element={<Home />} />  {/* ✅ New Route for Home */}
                </Route>

                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}

export default App;

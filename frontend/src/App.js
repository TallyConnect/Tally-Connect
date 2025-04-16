import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/signup";
import Profile from "./components/Profile";
import Events from "./components/events";   
import AdminDashboard from "./components/admin";  // ✅ Import Admin Page
import Home from "./components/home";  // ✅ Import Home Page
import Layout from "./components/layout";  // ✅ Import Layout
import UploadFlyer from "./components/uploadflyer";
import ModeratorEvents from "./components/modevents";
import Explore from "./components/explore"; // or wherever you store your components
import WarningsPage from "./components/warnings";
import Calendar from "./components/calendar";
import Feedback from "./components/feedback"; // ✅ Import the feedback page
import Disputes from "./components/disputes";
import SubmitDisputePage from "./components/submitdisputes"; // <-- User/Organizer submit
import MyDisputesPage from "./components/mydisputes";       // <-- Optional user view
import Analytics from "./components/analytics";       // <-- Optional user view

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>  
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/events" element={<Events />} /> {/*Add the route for Events*/}
                    <Route path="/admin" element={<AdminDashboard />} />  {/* ✅ New Route for Admin */}
                    <Route path="/home" element={<Home />} />  {/* ✅ New Route for Home */}
                    <Route path="/upload-flyer" element={<UploadFlyer />} />
                    <Route path="/moderator/events" element={<ModeratorEvents />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/warnings" element={<WarningsPage />} />
                    <Route path="/calendar" element={<Calendar />} /> {/* Add the route for Calendar */}
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/disputes" element={<Disputes />} />
                    <Route path="/submit-dispute" element={<SubmitDisputePage />} />
                    <Route path="/my-disputes" element={<MyDisputesPage />} />
                    <Route path="/analytics" element={<Analytics />} />

                </Route>

                <Route path="/" element={<Login />} /> 
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}

export default App;
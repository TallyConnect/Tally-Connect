import React, { useState } from "react";
import axios from "axios";

function UploadFlyer({ onSuccess }) {
    const [showPopup, setShowPopup] = useState(false); // Popup control
    const [file, setFile] = useState(null);
    const [eventData, setEventData] = useState({
        event_title: "",
        event_location: "",
        event_date: "",
        event_time: "",
        event_description: ""
    });

    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);

    // Fetch user profile to ensure only organizer can upload
    React.useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(error => console.error("Error fetching user profile:", error));
    }, []);

    const handleChange = (e) => {
        const { name,value } = e.target;
        setEventData({ ...eventData, [name]: value});
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("File selected:", file);

        if (!file) {
            setMessage("Please uplaod a flyer.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        Object.keys(eventData).forEach((key) => {
            formData.append(key, eventData[key]);
        });

        formData.append("user_name", user.user_name);

        console.log("Final Form Data:", Object.fromEntries(formData));

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/upload_flyer", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            
            setMessage(`Flyer uploaded successfully! Event ID: ${response.data.event_id}`);
            setShowPopup(false); // Close popup after successful upload
            if (onSuccess) onSuccess(response.data); // Refresh events grid
        } catch (error) {
            console.error("Error uploading flyer:", error);
            setMessage("Failed to upload flyer.");
        }
    };

    return (
        <div className="upload-flyer">
            {/* Upload Event Button to trigger popup */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowPopup(true)}
            >
                Upload Event
            </button>

            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Add New Event</h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div>
                                <label>Event Title:</label>
                                <input
                                    type="text"
                                    name="event_title"
                                    value={eventData.event_title}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Date:</label>
                                <input
                                    type="date"
                                    name="event_date"
                                    value={eventData.event_date}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="event_location"
                                    value={eventData.event_location}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Event Description:</label>
                                <textarea
                                name="event_description"
                                value={eventData.event_description}
                                onChange={handleChange}
                                required
                                className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Event Time:</label>
                                <input
                                type="time"
                                name="event_time"
                                value={eventData.event_time}
                                onChange={handleChange}
                                required
                                className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Flyer Image:</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                        {message && <p className="text-green-600 mt-2">{message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadFlyer;          
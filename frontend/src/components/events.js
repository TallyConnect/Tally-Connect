import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function Events() {
const [events, setEvents] = useState([]);
const [user, setUser] = useState(null);
const [message, setMessage] = useState("");
const [showUploadPopup, setShowUploadPopup] = useState(false);
const [showEventDetailsPopup, setShowEventDetailsPopup] = useState(false);
const [editingEvent, setEditingEvent] = useState(null);
const [eventData, setEventData] = useState({
event_title: "",
event_date: "",
event_location: "",
event_time: "",
event_description: "",
selectedFile: null,
category_id: [] // Initialize as an empty array
});
const [selectedEvent, setSelectedEvent] = useState(null);

/* ------------------------------------------------------------- */
/* Alert‑posting state – visible only to organizers */
/* ------------------------------------------------------------- */
const [showAlertPopup, setShowAlertPopup] = useState(false);
const [alertData, setAlertData] = useState({
alert_title: "",
alert_description: "",
alert_datetime: ""
});

// Add new state for tags
const [availableTags, setAvailableTags] = useState([]);
const [selectedTags, setSelectedTags] = useState([]);
const [showTagsDropdown, setShowTagsDropdown] = useState(false);
const [showCreateCategory, setShowCreateCategory] = useState(false);
const [newCategory, setNewCategory] = useState("");
const dropdownRef = useRef(null);
const date = new Date('2025-03-01T12:00:00-05:00'); // -05:00 = EST


// Automatically close the dropdown when clicking outside
useEffect(() => {
function handleClickOutside(event) {
if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
setShowTagsDropdown(false);
}
}

document.addEventListener("mousedown", handleClickOutside);
return () => {
document.removeEventListener("mousedown", handleClickOutside);
};
}, []);

useEffect(() => {
axios.get("http://127.0.0.1:5000/api/profile", { withCredentials: true })
.then(response => setUser(response.data))
.catch(error => console.error("Error fetching user profile:", error));
}, []);

useEffect(() => {
if (user) {
axios.get(`http://127.0.0.1:5000/api/events?role=${user.role}&username=${user.user_name}`)
.then(response => {
console.log("Fetched events:", response.data); // Log fetched events
setEvents(response.data);
})
.catch(error => console.error("Error fetching events:", error));
}
}, [user]);

// Fetch available tags on component mount
useEffect(() => {
const fetchTags = async () => {
try {
const response = await axios.get("http://127.0.0.1:5000/api/categories");
const tags = response.data.categories;
console.log("Available Tags:", tags); // Log the fetched tags
setAvailableTags(tags); // Update availableTags
// Do not initialize selectedTags with all tag IDs
} catch (error) {
console.error("Error fetching categories:", error);
}
};

fetchTags();
}, []);

useEffect(() => {
console.log("Available Tags State:", availableTags); // Log the state to verify data
}, [availableTags]);

useEffect(() => {
console.log("Selected Tags State:", selectedTags); // Log the updated state
}, [selectedTags]);

useEffect(() => {
if (showUploadPopup) {
setSelectedTags([]); // Reset selectedTags to an empty array
setEventData(prev => ({
...prev,
category_id: [] // Reset category_id to an empty array
}));
}
}, [showUploadPopup]);

const handleChange = (e) => {
const { name, value } = e.target;
console.log(`Updating ${name}:`, value); // Log the field being updated
setEventData(prevData => ({
...prevData,
[name]: value
}));
};

/* ------------ handlers for alert form ------------------------ */
const handleAlertChange = (e) => {
const { name, value } = e.target;
setAlertData(prev => ({ ...prev, [name]: value }));
};

const handlePostAlert = () => {
if (!selectedEvent) return;
if (!alertData.alert_title || !alertData.alert_datetime) {
alert("Title & date/time are required");
return;
}
axios.post("http://127.0.0.1:5000/api/post_alert", {
event_id: selectedEvent.event_id,
...alertData
}, { withCredentials: true })
.then(res => {
setMessage(res.data.message);
setShowAlertPopup(false);
setAlertData({ alert_title:"", alert_description:"", alert_datetime:"" });
})
.catch(err => {
console.error("Alert post failed:", err);
setMessage("Failed to post alert");
});
};

const handleFileChange = (e) => {
console.log("Selected File:", e.target.files[0]); // Log the selected file
setEventData(prevData => ({
...prevData,
selectedFile: e.target.files[0]
}));
};

const handleUpload = async () => {
console.log("Event Data Before Validation:", eventData); // Log event data before validation

if (
!eventData.selectedFile ||
!eventData.event_title ||
!eventData.event_date ||
!eventData.event_location ||
!eventData.category_id || // Ensure category_id exists
eventData.category_id.length === 0 // Ensure it's not empty
) {
alert("Please fill in all fields and upload a flyer.");
if (eventData.category_id.length === 0) {
alert("Please select at least one category.");
}
return;
}

const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
const fileExtension = eventData.selectedFile?.name.split(".").pop().toLowerCase();
if (!allowedExtensions.includes(fileExtension)) {
alert("Invalid file type. Please upload a valid image.");
return;
}

const formData = new FormData();
formData.append("file", eventData.selectedFile);
formData.append("user_name", user.user_name); // Organizer's username
formData.append("event_title", eventData.event_title); // Add relevant details
formData.append("event_description", eventData.event_description);
formData.append("event_location", eventData.event_location);
formData.append("event_date", eventData.event_date);
formData.append("event_time", eventData.event_time);
formData.append("category_id", JSON.stringify(eventData.category_id)); // Send category_id as JSON string

console.log("FormData being sent:");
for (let [key, value] of formData.entries()) {
console.log(`${key}:`, value);
}

try {
const response = await axios.post("http://127.0.0.1:5000/api/upload_flyer", formData, {
headers: { "Content-Type": "multipart/form-data" },
});
setMessage(response.data.message);
setEvents((prevEvents) => [
...prevEvents,
{
event_id: response.data.event_id,
event_title: eventData.event_title,
flyer_url: response.data.flyer_url,
},
]);
setShowUploadPopup(false); // Automatically close the popup
} catch (error) {
console.error("Error uploading flyer:", error);
setMessage("Error uploading flyer. Please try again.");
}
};

const handleEventClick = (eventId) => {
axios.get(`http://127.0.0.1:5000/api/events/${eventId}`)
.then(response => {
setSelectedEvent(response.data);
setShowEventDetailsPopup(true);
})
.catch(error => {
console.error("Error fetching event details:", error);
setMessage("Error fetching event details. Please try again.");
});
};

const handleDeleteEvent = async (eventId) => {
try {
const response = await axios.delete(`http://127.0.0.1:5000/api/events/${eventId}`);
setMessage(response.data.message);
setEvents(events.filter(event => event.event_id !== eventId)); // Remove event from the list
setShowEventDetailsPopup(false); // Close the popup
} catch (error) {
console.error("Error deleting event:", error);
setMessage("Error deleting event. Please try again.");
}
};

const handleUpdateEvent = async () => {
const formData = new FormData();
formData.append("event_title", eventData.event_title);
formData.append("event_description", eventData.event_description);
formData.append("event_location", eventData.event_location);
formData.append("event_date", eventData.event_date);
formData.append("event_time", eventData.event_time);
if (eventData.selectedFile) {
formData.append("file", eventData.selectedFile);
}
try {
const response = await axios.put(`http://127.0.0.1:5000/api/events/${editingEvent.event_id}`, formData, {
headers: { "Content-Type": "multipart/form-data" },
withCredentials: true
});
setMessage(response.data.message);
setEvents(prev =>
prev.map(e => e.event_id === editingEvent.event_id ? { ...e, ...eventData } : e)
);
setShowEventDetailsPopup(false);
setEditingEvent(null);
} catch (error) {
console.error("Update failed:", error);
setMessage("Failed to update event.");
}
};

// Function to handle creating a new category
const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
        alert("Category name cannot be empty.");
        return; // Validate input
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/api/categories",
            { category_name: newCategory },
            { withCredentials: true }
        );

        if (response.data.success) {
            // Add the new category to availableTags
            setAvailableTags((prev) => [
                ...prev,
                { id: response.data.category_id, name: response.data.category_name },
            ]);

            // Clear input field and close the prompt
            setNewCategory("");
            setShowCreateCategory(false);

            // Optionally, log success message
            console.log("Category created successfully:", response.data.category_name);
        } else {
            alert(response.data.message || "Failed to create category.");
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert("You are not authorized to create a category.");
        } else {
            console.error("Error creating category:", error);
            alert("Something went wrong while creating the category.");
        }
    }
};

if (!user) return <p>Loading profile...</p>;

return (
<div className="p-4">
<style>
{
`.grid-container {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 20px;
padding: 20px;
background-color: #f9f9f9;
}
.grid-item {
background-color: #fff;
border: 2px solid #e0e0e0;
border-radius: 12px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
overflow: hidden;
text-align: center;
transition: transform 0.2s ease-in-out;
}
.grid-item:hover {
transform: scale(1.05);
}
.flyer-image {
width: 100%;
height: 300px;
object-fit: cover;
border-bottom: 2px solid #e0e0e0;
}
.event-title {
font-weight: bold;
padding: 10px 0;
}
.popup {
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background-color: white;
padding: 20px;
border: 2px solid #e0e0e0;
border-radius: 12px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
z-index: 1000;
}
.popup img {
margin-top:10px;
}`
}
</style>

<h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
{message && <p className="text-green-600">{message}</p>}

<div className="grid-container">
{events.map(event => (
<div key={event.event_id} className="grid-item" onClick={() => handleEventClick(event.event_id)}>
<img 
src={`http://127.0.0.1:5000${event.flyer_url}`} 
alt={event.event_title} 
className="flyer-image" 
/>
<h3 className="event-title">{event.event_title}</h3>
{/* Display alerts for the event */}
{event.alerts && event.alerts.length > 0 && (
<div className="alerts">
<h4 className="text-lg font-bold">Alerts:</h4>
<ul>
{event.alerts.map((alert, index) => (
<li key={index}>
<strong>{alert.alert_title}</strong> - {alert.alert_datetime}
<p>{alert.alert_description}</p>
</li>
))}
</ul>
</div>
)}
</div>
))}
</div>

{user.role.toLowerCase() === 'organizer' && (
<div className="mt-4">
<button
className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md"
onClick={() => setShowUploadPopup(true)}
>
Upload Event
</button>
</div>
)}

{showUploadPopup && (
<div className="popup">
<h3>Enter Event Details</h3>
<input
type="text"
name="event_title"
placeholder="Event Title"
onChange={handleChange}
/>
<input
type="date"
name="event_date"
onChange={handleChange}
/>
<input
type="text"
name="event_location"
placeholder="Location"
onChange={handleChange}
/>
<input
type="time"
name="event_time"
onChange={handleChange}
/>
<textarea
name="event_description"
placeholder="Event Description"
onChange={handleChange}
/>
<input
type="file"
onChange={handleFileChange}
accept=".png,.jpg,.jpeg,.gif"
/>

{/* Custom Multi-Select Category Dropdown */}
<div className="mt-4 relative" ref={dropdownRef}>
  {/* Dropdown Box */}
  <div
    className={`w-full min-h-[2.5rem] px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer ${
      selectedTags.length === 0 ? "text-gray-400" : "text-black"
    }`}
    onClick={() => setShowTagsDropdown(prev => !prev)}
  >
    {selectedTags.length === 0 ? (
      <span className="text-sm">Select Categories...</span>
    ) : (
      availableTags
        .filter(tag => selectedTags.includes(tag.id))
        .map(tag => tag.name)
        .join(", ")
    )}
  </div>

  {/* Dropdown Menu */}
  {showTagsDropdown && (
    <div
      className="absolute top-full mt-1 z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg"
      style={{ maxHeight: '240px', overflowY: 'auto' }}
    >
      <ul className="flex flex-col divide-y divide-gray-100">
        {availableTags.length > 0 ? (
          availableTags.map(tag => (
            <li key={tag.id} className="px-4 py-2 hover:bg-gray-100">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    const updatedTags = e.target.checked
                      ? [...new Set([...selectedTags, tag.id])]
                      : selectedTags.filter(id => id !== tag.id);

                    setSelectedTags(updatedTags);
                    setEventData(prev => ({
                      ...prev,
                      category_id: updatedTags,
                    }));
                  }}
                  className="form-checkbox text-blue-600"
                />
                <span className="text-sm">{tag.name}</span>
              </label>
            </li>
          ))
        ) : (
          <li className="text-gray-500 px-4 py-2">Loading categories...</li>
        )}

        {/* Add option to create a new category */}
        <li
          className="px-4 py-2 text-blue-500 cursor-pointer hover:bg-gray-100"
          onClick={() => setShowCreateCategory(true)}
        >
          + Create new category...
        </li>
      </ul>
    </div>
  )}

  {/* New Category Creation Prompt */}
  {showCreateCategory && (
    <div className="popup">
      <h3>Create New Category</h3>
      <input
        type="text"
        placeholder="Category Name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
      <div className="mt-4">
        <button
          onClick={handleCreateCategory}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Save Category
        </button>
        <button
          onClick={() => setShowCreateCategory(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

<button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md">Submit</button>
<button onClick={() => setShowUploadPopup(false)} className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md">Cancel</button>
</div>
)}

{showEventDetailsPopup && selectedEvent && (
<div className="popup">
<h3>{selectedEvent.event_title}</h3>
<img 
src={`http://127.0.0.1:5000${selectedEvent.flyer_url}`} 
alt={selectedEvent.event_title} 
className="flyer-image" 
/>
<p><strong>Description:</strong> {selectedEvent.event_description}</p>
<p><strong>Location:</strong> {selectedEvent.event_location}</p>
<p><strong>Date & Time:</strong> {new Date(`${selectedEvent.event_date}T${selectedEvent.event_time}Z`).toLocaleString()}</p>
{user.role.toLowerCase() === "organizer" && user.user_name === selectedEvent.user_name ? (
<>
<button
onClick={() => setShowAlertPopup(true)}
className="bg-indigo-500 text-white px-4 py-2 mt-2 rounded-md"
>
Post Alert
</button>
<button
onClick={() => handleDeleteEvent(selectedEvent.event_id)}
className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md"
>
Delete Event
</button>
</>
) : null}
<button onClick={() => setShowEventDetailsPopup(false)} className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-md">Close</button>
{user.role.toLowerCase() === 'organizer' && user.user_name === selectedEvent.user_name && (
<button onClick={() => {
setEditingEvent(selectedEvent);
setEventData({
event_title: selectedEvent.event_title,
event_description: selectedEvent.event_description,
event_location: selectedEvent.event_location,
event_date: selectedEvent.event_date,
event_time: selectedEvent.event_time,
selectedFile: null,
category_id: selectedEvent.category_id || [] // Set category_id
});
setSelectedTags(selectedEvent.category_id || []); // Update selectedTags
}} className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded-md">Edit</button>
)}
</div>
)}

{/* -------------------- Alert popup --------------------- */}
{showAlertPopup && (
<div className="popup">
<h3>Post Alert for: {selectedEvent?.event_title}</h3>
<input
type="text"
name="alert_title"
placeholder="Alert Title"
value={alertData.alert_title}
onChange={handleAlertChange}
/>
<textarea
name="alert_description"
placeholder="Description (optional)"
value={alertData.alert_description}
onChange={handleAlertChange}
/>
<input
type="datetime-local"
name="alert_datetime"
value={alertData.alert_datetime}
onChange={handleAlertChange}
/>
<button onClick={handlePostAlert}
className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md">
Submit
</button>
<button onClick={() => setShowAlertPopup(false)}
className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-md">
Cancel
</button>
</div>
)}

{editingEvent && (
<div className="popup">
<h3>Edit Event</h3>
<input
type="text"
name="event_title"
placeholder="Event Title"
value={eventData.event_title}
onChange={handleChange}
/>
<input
type="date"
name="event_date"
value={eventData.event_date}
onChange={handleChange}
/>
<input
type="text"
name="event_location"
placeholder="Location"
value={eventData.event_location}
onChange={handleChange}
/>
<input
type="time"
name="event_time"
value={eventData.event_time}
onChange={handleChange}
/>
<textarea
name="event_description"
placeholder="Event Description"
value={eventData.event_description}
onChange={handleChange}
/>
<input
type="file"
onChange={handleFileChange}
accept=".png,.jpg,.jpeg,.gif"
/>
<button onClick={handleUpdateEvent} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md">Save Changes</button>
<button onClick={() => setEditingEvent(null)} className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-md">Cancel</button>
</div>
)}
</div>
);
}

export default Events;
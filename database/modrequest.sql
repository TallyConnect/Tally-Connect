CREATE TABLE moderator_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    dispute_id INT,
    event_id VARCHAR(20),
    moderator_id VARCHAR(20),
    organizer_id VARCHAR(20),
    request_message TEXT NOT NULL,
    request_status ENUM('pending', 'addressed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(dispute_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (moderator_id) REFERENCES users(user_name),
    FOREIGN KEY (organizer_id) REFERENCES users(user_name)
);

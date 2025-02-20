CREATE TABLE EVENTS (
    event_id VARCHAR(20) PRIMARY KEY NOT NULL,
    user_id INT(7),
    event_title VARCHAR(100) NOT NULL,
    event_description TEXT NOT NULL,
    event_location VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_status ENUM('Scheduled', 'Canceled', 'Completed') NOT NULL,
    event_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

INSERT INTO events (event_id, organizer_id, event_title, event_description, event_location, event_date, event_time, event_status, event_created, event_last_updated) VALUES
('E001', 1, 'Community BBQ', 'A fun BBQ event for the neighborhood', 'Central Park', '2025-03-01', '12:00:00', 'Scheduled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CREATE TABLE events (
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
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO events (event_id, user_id, event_title, event_description, event_location, event_date, event_time, event_status, event_created, event_last_updated) VALUES
('E001', 1, 'Community BBQ', 'A fun BBQ event for the neighborhood', 'Central Park', '2025-03-01', '12:00:00', 'Scheduled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO events (event_id, user_id, event_title, event_description, event_location, event_date, event_time, event_status) VALUES
('E1001', 2, 'Study Session at Coleman Library', 'A focused study session at Coleman Library for students.', 'Coleman Library, FAMU', '2024-12-03', '10:00:00', 'Scheduled'),
('E1002', 2, 'Back to School Event', 'Kick off the semester with networking and free resources.', 'FAMU Campus', '2025-01-04', '13:00:00', 'Scheduled'),
('E1003', 2, 'Volunteer at Cascades Park', 'Join us to clean up Cascades Park and make a positive impact.', 'Cascades Park, Tallahassee', '2025-03-03', '09:00:00', 'Scheduled');

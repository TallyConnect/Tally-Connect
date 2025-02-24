CREATE TABLE events (
    event_id VARCHAR(20) NOT NULL,
    user_name VARCHAR(20) NOT NULL,
    event_title VARCHAR(100) NOT NULL,
    event_description TEXT NOT NULL,
    event_location VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_status ENUM('Scheduled', 'Canceled', 'Completed') NOT NULL,
    event_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id), 
    FOREIGN KEY (user_name) REFERENCES users(user_name) ON DELETE CASCADE
);

 INSERT INTO events (event_id, user_name, event_title, event_description, event_location, event_date, event_time, event_status, event_created, event_last_updated) VALUES
 ('E001', 'JaneSmith', 'Community BBQ', 'A fun BBQ event for the neighborhood', 'Central Park', '2025-03-01', '12:00:00', 'Scheduled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

 INSERT INTO events (event_id, user_name, event_title, event_description, event_location, event_date, event_time, event_status) VALUES
 ('E1001', 'SophiaMartinez', 'Study Session at Coleman Library', 'A focused study session at Coleman Library for students.', 'Coleman Library, FAMU', '2024-12-03', '10:00:00', 'Scheduled'),
 ('E1002', 'Second Harvest', 'Find Food Near You Pick-up Volunteers', 'Volunteers needed to distubute food.', '4446 Entrepot Blvd', '2025-01-04', '13:00:00', 'Scheduled'),
 ('E1003', 'DanielClark', 'Volunteer at Cascades Park', 'Join us to clean up Cascades Park and make a positive impact.', 'Cascades Park, Tallahassee', '2025-03-03', '09:00:00', 'Scheduled'),
 ('E1004', 'FAMU-FSU NSBE', 'Tech & Leadership Conference', 'An interactive conference on technology and leadership.', 'FSU Innovation Hub', '2025-05-10', '14:00:00', 'Scheduled');

-- EXAMPLE QUERY (new)
-- INSERT INTO events (event_id, user_name, event_title, event_description, event_location, event_date, event_time, event_status) VALUES
 ('E1007', 'DavidWilson', 'Test', 'Test.', 'Test', '2024-12-03', '10:00:00', 'Scheduled');

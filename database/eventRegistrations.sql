CREATE TABLE Event_registration (
    registration_id INT(10) PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique identifier for each registration',
    event_id VARCHAR(20) NOT NULL COMMENT 'ID of the event being registered for',
    user_id INT(7) NOT NULL COMMENT 'ID of the participant being registered',
    registration_status BOOLEAN COMMENT 'Stores whether a user is registered for an event or not',
    registration_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the registration was created',
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(event_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO event_registrations (event_id, participant_id, registration_status, registration_created) VALUES
('E001', 2, TRUE, CURRENT_TIMESTAMP),
('E1002', 1, TRUE), ('E1002', 3, TRUE),
('E1003', 2, TRUE), ('E1003', 3, TRUE);
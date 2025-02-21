CREATE TABLE announcements (
    announcement_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(20) NOT NULL,
    organizer_id INTEGER(7) NOT NULL,
    announcement_message TEXT,
    announcement_date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (organizer_id) REFERENCES users (user_id)
);

INSERT INTO announcements (event_id, organizer_id, announcement_message, announcement_date_posted) VALUES
('E001', 1, 'Join us for the community BBQ!', CURRENT_TIMESTAMP);

INSERT INTO announcements (event_id, user_id, announcement_message) VALUES
('E1001', 2, 'Reminder: Study Session at Coleman Library on Dec 3rd!'),
('E1002', 2, 'Get ready for Back to School at FAMU on Jan 4th!');

CREATE TABLE announcements (
    announcement_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(20) NOT NULL,
    organizer_id VARCHAR(20) NOT NULL,
    announcement_message TEXT,
    announcement_date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (organizer_id) REFERENCES users (user_name)
);

 INSERT INTO announcements (event_id, organizer_id, announcement_message, announcement_date_posted) VALUES
 ('E1003', 'DanielClark', 'Reminder: Join us for the Volunteer Event at Cascades Park on March 3rd!', CURRENT_TIMESTAMP),
 ('E1004', 'FAMU-FSU NSBE', 'Reminder: Don\'t miss the Tech & Leadership Conference at FSU Innovation Hub on May 10th!', CURRENT_TIMESTAMP);

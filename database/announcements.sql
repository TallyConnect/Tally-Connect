CREATE TABLE announcements (
    announcement_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(20) NOT NULL,
    organizer_id INTEGER(7) NOT NULL,
    announcement_message TEXT,
    announcement_date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (organizer_id) REFERENCES users (user_id)
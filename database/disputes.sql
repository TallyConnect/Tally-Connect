CREATE TABLE disputes (
    dispute_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    raised_by INTEGER(7) NOT NULL,
    event_id VARCHAR(20) NOT NULL,
    moderator_id INTEGER(7) NOT NULL,
    dispute_status ENUM('pending', 'resolved', 'new dispute-unopened') NOT NULL,
    dispute_resolution TEXT DEFAULT NULL,
    dispute_date_resolved TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (raised_by) REFERENCES users (user_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (moderator_id) REFERENCES users (user_id)
);
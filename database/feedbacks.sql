CREATE TABLE feedback (
    feedback_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(20) NOT NULL,
    participant_id INTEGER(7) NOT NULL,
    feedback_rating INTEGER(5) NOT NULL,
    feedback_comments TEXT,
    feedback_date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (participant_id) REFERENCES users (user_id)
);

INSERT INTO feedback (event_id, participant_id, feedback_rating, feedback_comments, feedback_date_submitted) VALUES
('E001', 2, 5, 'Great event!', CURRENT_TIMESTAMP);
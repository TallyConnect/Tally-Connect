CREATE TABLE feedback (
    feedback_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(20) NOT NULL,
    user_id INTEGER(7) NOT NULL,
    feedback_rating INTEGER(5) NOT NULL,
    feedback_comments TEXT,
    feedback_date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

INSERT INTO feedback (event_id, user_id, feedback_rating, feedback_comments, feedback_date_submitted) VALUES
('E001', 2, 5, 'Great event!', CURRENT_TIMESTAMP);

INSERT INTO feedback (event_id, user_id, feedback_rating, feedback_comments) VALUES
('E1001', 1, 5, 'Great study session, very helpful!'),
('E1002', 3, 4, 'The Back to School event was well-organized.');
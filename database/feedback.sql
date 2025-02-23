CREATE TABLE feedback (
    feedback_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(20) NOT NULL,
    user_name VARCHAR(20) NOT NULL,
    feedback_rating INTEGER(5) NOT NULL,
    feedback_comments TEXT,
    feedback_date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (user_name) REFERENCES users (user_name)
);

 INSERT INTO feedback (event_id, user_name, feedback_rating, feedback_comments, feedback_date_submitted) VALUES
 ('E001', 'AliceJohnson', 5, 'Great event! Loved the BBQ!', CURRENT_TIMESTAMP),  
 ('E001', 'MichaelBrown', 4, 'Had a great time at the Community BBQ!', CURRENT_TIMESTAMP),

 ('E1001', 'ChristopherAnderson', 5, 'Great study session, very helpful!', CURRENT_TIMESTAMP),  
 ('E1001', 'SophiaHarris', 5, 'Well-organized and productive.', CURRENT_TIMESTAMP);
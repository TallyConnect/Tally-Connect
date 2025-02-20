CREATE TABLE users(
    user_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(20) NOT NULL,
    user_email VARCHAR(50) NOT NULL,
    user_password VARCHAR(60) NOT NULL,
    user_contact_details VARCHAR(50) NOT NULL,
    user_preferences TEXT NOT NULL,
    user_status ENUM('Active', 'Warning', 'Suspended') NOT NULL,
    user_created TIMESTAMP,
    user_last_updated TIMESTAMP
);

INSERT INTO users (user_name, user_email, user_password, user_contact_details, user_preferences, user_status, user_created, user_last_updated) VALUES
('JohnDoe', 'john@example.com', 'password123', '555-1234, john.alt@example.com', 'Sports, Music', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JaneSmith', 'jane@example.com', 'password456', '555-5678, jane.alt@example.com', 'Cooking, Travel', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
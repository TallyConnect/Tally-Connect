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
    flyer_url VARCHAR(500),
    PRIMARY KEY (event_id), 
    FOREIGN KEY (user_name) REFERENCES users(user_name) ON DELETE CASCADE
);

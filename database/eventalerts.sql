CREATE TABLE event_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(20) NOT NULL,
    alert_title VARCHAR(100) NOT NULL,
    alert_description TEXT,
    alert_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

CREATE TABLE analytics_reports (
    report_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    generated_by INTEGER(7) NOT NULL,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_type ENUM('event', 'user profile') NOT NULL,
    report_data JSON,
    FOREIGN KEY (generated_by) REFERENCES users (user_id)
);

INSERT INTO analytics_reports (generated_by, report_date, report_type, report_data) VALUES
(1, CURRENT_TIMESTAMP, 'event', '{ "event": "Community BBQ", "participants": 50 }');
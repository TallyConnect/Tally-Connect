CREATE TABLE analytics_reports (
    report_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    generated_by VARCHAR (20) NOT NULL,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_type ENUM('event', 'user profile') NOT NULL,
    report_data JSON,
    FOREIGN KEY (generated_by) REFERENCES users (user_name)
);

 -- Event Registration Summary for Community BBQ
 INSERT INTO analytics_reports (generated_by, report_date, report_type, report_data)
 SELECT 'SarahDavis', CURRENT_TIMESTAMP, 'event',
     JSON_OBJECT('event', 'Community BBQ', 'participants', COUNT(*))
 FROM eventRegistrations
 WHERE event_id = 'E001';

 -- Event Registration Summary for Study Session at Coleman Library
 INSERT INTO analytics_reports (generated_by, report_date, report_type, report_data)
 SELECT 'JohnDoe', CURRENT_TIMESTAMP, 'event',
     JSON_OBJECT('event_id', 'E1001', 'attendees', COUNT(*))
 FROM eventRegistrations
 WHERE event_id = 'E1001';

 -- User Profile Report: Count of Active and Suspended Users
 INSERT INTO analytics_reports (generated_by, report_date, report_type, report_data)
 SELECT 'SarahDavis', CURRENT_TIMESTAMP, 'user profile',
     JSON_OBJECT(
         'active_users', COUNT(CASE WHEN user_status = 'Active' THEN 1 END),
         'suspended_users', COUNT(CASE WHEN user_status = 'Suspended' THEN 1 END)
     )
 FROM users; 

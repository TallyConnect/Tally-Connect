CREATE TABLE disputes (
    dispute_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    raised_by VARCHAR (20) NOT NULL,
    event_id VARCHAR(20) NOT NULL,
    admin_id VARCHAR(20) NOT NULL,
    dispute_summary TEXT DEFAULT NULL,
    dispute_status ENUM('PENDING', 'RESOLVED', 'NEW DISPUTE-UNOPENED') NOT NULL,
    dispute_resolution TEXT DEFAULT NULL,
    dispute_date_resolved TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (raised_by) REFERENCES users (user_name),
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (admin_id) REFERENCES users (user_name)
);

 INSERT INTO disputes (raised_by, event_id, admin_id, dispute_summary, dispute_status, dispute_resolution, dispute_date_resolved) VALUES
('AliceJohnson', 'E0001', 'BobBrown', 
 'I was told I was registered, but I don’t see the event on my profile.', 
 'resolved', 
 'User was manually registered for the event.', 
 CURRENT_TIMESTAMP),

('MichaelBrown', 'E0001', 'EmilyMartinez', 
 'I signed up but never received a confirmation.', 
 'pending', 
 NULL, 
 NULL),

('SophiaHarris', 'E0002', 'JessicaTaylor', 
 'The event location was incorrect on the registration page.', 
 'new dispute-unopened', 
 NULL, 
 NULL),

('DavidWilson', 'E0003', 'DanielWhite', 
 'System said I wasn’t registered, but I showed up and was denied entry.', 
 'resolved', 
 'Confirmed registration manually.', 
 CURRENT_TIMESTAMP),

('EmilyMartinez', 'E0004', 'DanielWhite', 
 'I attended the event but didn’t get marked as present.', 
 'pending', 
 NULL, 
 NULL),

('RobertLopez', 'E0004', 'EmilyMartinez', 
 'I received a cancellation notice after arriving at the venue.', 
 'new dispute-unopened', 
 NULL, 
 NULL);


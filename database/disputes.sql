CREATE TABLE disputes (
    dispute_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    raised_by VARCHAR (20) NOT NULL,
    event_id VARCHAR(20) NOT NULL,
    moderator_id VARCHAR(20) NOT NULL,
    dispute_status ENUM('pending', 'resolved', 'new dispute-unopened') NOT NULL,
    dispute_resolution TEXT DEFAULT NULL,
    dispute_date_resolved TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (raised_by) REFERENCES users (user_name),
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (moderator_id) REFERENCES users (user_name)
);

 INSERT INTO disputes (raised_by, event_id, moderator_id, dispute_status, dispute_resolution, dispute_date_resolved) VALUES
 ('AliceJohnson', 'E0001', 'SarahDavis', 'resolved', 'User was manually registered for the event.', CURRENT_TIMESTAMP),
 ('MichaelBrown', 'E0001', 'JessicaTaylor', 'pending', NULL, NULL),
 ('SophiaHarris', 'E0002', 'JessicaTaylor', 'new dispute-unopened', NULL, NULL),
 ('DavidWilson', 'E0003', 'JessicaTaylor', 'resolved', 'Confirmed registration manually.', CURRENT_TIMESTAMP),
 ('EmilyMartinez', 'E0004', 'JessicaTaylor', 'pending', NULL, NULL),
 ('RobertLopez', 'E0004', 'JessicaTaylor', 'new dispute-unopened', NULL, NULL);

CREATE TABLE eventRegistrations (
    registration_id INT(10) PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique identifier for each registration',
    event_id VARCHAR(20) NOT NULL COMMENT 'ID of the event being registered for',
    user_name VARCHAR(20) NOT NULL COMMENT 'ID of the participant being registered',
    registration_status BOOLEAN COMMENT 'Stores whether a user is registered for an event or not',
    registration_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the registration was created',
    CONSTRAINT fk_event_reg FOREIGN KEY (event_id) REFERENCES events(event_id),
    CONSTRAINT fk_user_reg FOREIGN KEY (user_name) REFERENCES users(user_name)
);

 INSERT INTO eventRegistrations (event_id, user_name, registration_status, registration_created) VALUES
 ('E0001', 'AliceJohnson', TRUE, CURRENT_TIMESTAMP),  
 ('E0001', 'MichaelBrown', TRUE, CURRENT_TIMESTAMP),  

 ('E0001', 'ChristopherAnderson', TRUE, CURRENT_TIMESTAMP),  
 ('E0002', 'SophiaHarris', TRUE, CURRENT_TIMESTAMP),  

 ('E0002', 'DavidWilson', TRUE, CURRENT_TIMESTAMP),  
 ('E0002', 'RobertLopez', TRUE, CURRENT_TIMESTAMP),  

 ('E0003', 'SophiaHarris', TRUE, CURRENT_TIMESTAMP),  

 ('E0004', 'AshleyThomas', TRUE, CURRENT_TIMESTAMP),  
 ('E0004', 'DavidWilson', TRUE, CURRENT_TIMESTAMP),  
 ('E0004', 'MichaelBrown', TRUE, CURRENT_TIMESTAMP);

-- TEST QUERY (new)
-- INSERT INTO eventRegistrations (event_id, user_name, registration_status, registration_created) VALUES ('E1004', 'SophiaHarris', TRUE, CURRENT_TIMESTAMP);
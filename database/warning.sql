CREATE TABLE warnings (
    warning_id INTEGER(7) PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR (20) NOT NULL,
    warning_reason TEXT NOT NULL,
    warning_status ENUM('yellow', 'red', 'black') NOT NULL,
    warning_issued_by VARCHAR (20) NOT NULL,
    warning_date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    warning_resolution BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_name) REFERENCES users (user_name) ON DELETE CASCADE,
    FOREIGN KEY (warning_issued_by) REFERENCES users (user_name) ON DELETE CASCADE
);

 INSERT INTO warnings (user_name, warning_reason, warning_status, warning_issued_by, warning_date_issued, warning_resolution) 
VALUES 
('AshleyThomas', 'Inappropriate content', 'red', 'EmilyMartinez', CURRENT_TIMESTAMP, TRUE);



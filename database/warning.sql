CREATE TABLE warnings (
    warning_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER(7) NOT NULL,
    warning_reason TEXT NOT NULL,
    warning_status ENUM('yellow', 'red', 'black'),
    warning_issued_by INTEGER(7) NOT NULL,
    warning_date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    warning_resolution BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (warning_issued_by) REFERENCES users (user_id)
);
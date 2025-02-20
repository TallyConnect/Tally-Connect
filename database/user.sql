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
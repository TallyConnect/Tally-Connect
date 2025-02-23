CREATE TABLE user_roles (
    user_id VARCHAR(10) NOT NULL,
    role_id ENUM('Moderator', 'Organizer', 'Administrator', 'User') NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);


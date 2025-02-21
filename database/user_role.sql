CREATE TABLE user_roles (
    user_id INTEGER(7),
    role_id ENUM('Moderator', 'Organizer', 'Adminastrator', 'User'),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 'Admin'),
(2, 'Organizer'),
(3, 'Moderator');
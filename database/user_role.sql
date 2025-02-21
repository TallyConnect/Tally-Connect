CREATE TABLE user_roles (
    user_id INTEGER(7),
    role_id ENUM('Moderator', 'Organizer', 'Adminastrator', 'User')R,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2);
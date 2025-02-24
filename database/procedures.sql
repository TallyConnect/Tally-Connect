DELIMITER //

CREATE PROCEDURE insert_user_with_role(
    IN user_name VARCHAR(20),
    IN user_email VARCHAR(50),
    IN user_password VARCHAR(60),
    IN user_contact_details VARCHAR(50),
    IN user_preferences TEXT,
    IN user_status ENUM('Active', 'Warning', 'Suspended'),
    IN role ENUM('Moderator', 'Organizer', 'Administrator', 'User'),
    IN user_created TIMESTAMP,
    IN user_last_updated TIMESTAMP
)
BEGIN
    DECLARE new_user_id VARCHAR(10);
    DECLARE role_prefix CHAR(1);
    DECLARE last_id INT;

    -- Assign a prefix based on role
    CASE role
        WHEN 'Moderator' THEN SET role_prefix = 'M';
        WHEN 'Organizer' THEN SET role_prefix = 'O';
        WHEN 'Administrator' THEN SET role_prefix = 'A';
        WHEN 'User' THEN SET role_prefix = 'U';
    END CASE;

    -- Find the last used ID for the selected role
    SELECT COALESCE(MAX(CAST(SUBSTRING(user_id, 2, 4) AS UNSIGNED)), 0) + 1 
    INTO last_id
    FROM users
    WHERE user_id LIKE CONCAT(role_prefix, '%');

    -- Format the new ID with leading zeros (e.g., 'M0001', 'O0002')
    SET new_user_id = CONCAT(role_prefix, LPAD(last_id, 4, '0'));

    -- Insert the new user into the users table with timestamps
    INSERT INTO users (user_id, user_name, user_email, user_password, user_contact_details, user_preferences, user_status, user_created, user_last_updated)
    VALUES (new_user_id, user_name, user_email, user_password, user_contact_details, user_preferences, user_status, user_created, user_last_updated);

END;
//

DELIMITER ;

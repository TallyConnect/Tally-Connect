DELIMITER //

CREATE PROCEDURE insert_event(
    IN user_name VARCHAR(20),
    IN event_title VARCHAR(100),
    IN event_description TEXT,
    IN event_location VARCHAR(50),
    IN event_date DATE,
    IN event_time TIME,
    IN event_status ENUM('Scheduled', 'Canceled', 'Completed')
    IN flyer_url VARCHAR(500)
)
BEGIN
    DECLARE new_event_id VARCHAR(10);
    DECLARE last_id INT;

    -- Find the last used event_id and increment
    SELECT COALESCE(MAX(CAST(SUBSTRING(event_id, 2, 4) AS UNSIGNED)), 0) + 1 
    INTO last_id
    FROM events;

    -- Format the new event ID with leading zeros (e.g., 'E0001', 'E0002')
    SET new_event_id = CONCAT('E', LPAD(last_id, 4, '0'));

    -- Insert the new event
    INSERT INTO events (event_id, user_name, event_title, event_description, event_location, event_date, event_time, event_status, flyer_url, event_created, event_last_updated)
    VALUES (new_event_id, user_name, event_title, event_description, event_location, event_date, event_time, event_status, flyer_url, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    
    -- Return the new event_id (optional)
    SELECT new_event_id AS 'Generated Event ID';
END;
//

DELIMITER ;

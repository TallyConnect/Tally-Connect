CREATE TABLE users(
    user_id INTEGER PRIMARY KEY,
    user_name VARCHAR,
    user_email VARCHAR,
    user_password VARCHAR,
    user_contact_details TEXT,
    user_preferences TEXT,
    user_status VARCHAR,
    user_created TIMESTAMP,
    user_last_updated TIMESTAMP
);
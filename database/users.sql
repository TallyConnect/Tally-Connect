CREATE TABLE users(
    user_name VARCHAR(20) PRIMARY KEY NOT NULL,
    user_email VARCHAR(50) NOT NULL,
    user_password VARCHAR(60) NOT NULL,
    user_contact_details VARCHAR(50) NOT NULL,
    user_preferences TEXT NOT NULL,
    user_status ENUM('Active', 'Warning', 'Suspended') NOT NULL,
    role ENUM('Moderator', 'Organizer', 'Administrator', 'User') NOT NULL,
    user_created TIMESTAMP,
    user_last_updated TIMESTAMP

);

INSERT INTO users (user_name, user_email, user_password, user_contact_details, user_preferences, user_status, role, user_created, user_last_updated)
VALUES
    ('JohnDoe', 'john@example.com', 'password123', '555-1234', 'N/A', 'Active', 'Moderator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('JaneSmith', 'jane@example.com', 'password456', '555-5678', 'Cooking, Travel', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('FAMU-FSU NSBE', 'FAMFSUNSBE.@example.com', 'password111', '555-2345', 'Event Planning, Public Speaking', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Second Harvest', '2Harvest.r@example.com', 'password222', '555-6789', 'Workshops, Community Service', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('DanielClark', 'daniel.c@example.com', 'password333', '555-5432', 'Networking, Business Events', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('SophiaMartinez', 'sophia.m@example.com', 'password444', '555-9876', 'Conferences, Team Management', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('AliceJohnson', 'alice@example.com', 'securepass', '555-9876', 'Reading, Chess', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('MichaelBrown', 'michael.b@example.com', 'securepass1', '555-1111', 'Tech, Programming', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('SarahDavis', 'sarah.d@example.com', 'securepass2', '555-2222', 'Gaming, Streaming', 'Active', 'Moderator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('DavidWilson', 'david.w@example.com', 'securepass3', '555-3333', 'Sports, Fitness', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('EmilyMartinez', 'emily.m@example.com', 'securepass4', '555-4444', 'Cooking, Blogging', 'Active', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('RobertLopez', 'robert.l@example.com', 'securepass5', '555-5555', 'Cars, Racing', 'Warning', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('JessicaTaylor', 'jessica.t@example.com', 'securepass6', '555-6666', 'Photography, Traveling', 'Active', 'Moderator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ChristopherAnderson', 'chris.a@example.com', 'securepass7', '555-7777', 'Science, Research', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('AshleyThomas', 'ashley.t@example.com', 'securepass8', '555-8888', 'Dancing, Music', 'Suspended', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('DanielWhite', 'daniel.w@example.com', 'securepass9', '555-9999', 'Volunteering, Social Work', 'Active', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('SophiaHarris', 'sophia.h@example.com', 'securepass10', '555-1010', 'Reading, Writing', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('BobBrown', 'bob@gmail.com', 'adminpass', '555-4321', 'N/A', 'Active', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- EXAMPLE Query (new)
-- INSERT INTO users ('TestUser2', 'test2@example.com', 'pwwhbviwjhjhvjkh', '444-5555', 'N/A', 'Active', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

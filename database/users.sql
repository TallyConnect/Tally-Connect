CREATE TABLE users(
    user_id VARCHAR(10) PRIMARY KEY NOT NULL,
    user_name VARCHAR(20)NOT NULL UNIQUE,
    user_email VARCHAR(50) NOT NULL,
    user_password VARCHAR(60) NOT NULL,
    user_contact_details VARCHAR(50) NOT NULL,
    user_preferences TEXT NOT NULL,
    user_status ENUM('Active', 'Warning', 'Suspended') NOT NULL,
    user_created TIMESTAMP,
    user_last_updated TIMESTAMP
);

-- Inserting a Moderator
CALL insert_user_with_role('JohnDoe', 'john@example.com', 'password123', '555-1234', 'N/A', 'Active', 'Moderator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserting an Organizer
CALL insert_user_with_role('JaneSmith', 'jane@example.com', 'password456', '555-5678', 'Cooking, Travel', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('FAMU-FSU NSBE', 'FAMFSUNSBE.@example.com', 'password111', '555-2345', 'Event Planning, Public Speaking', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('Second Harvest', '2Harvest.r@example.com', 'password222', '555-6789', 'Workshops, Community Service', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('DanielClark', 'daniel.c@example.com', 'password333', '555-5432', 'Networking, Business Events', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('SophiaMartinez', 'sophia.m@example.com', 'password444', '555-9876', 'Conferences, Team Management', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserting a Regular User
CALL insert_user_with_role('AliceJohnson', 'alice@example.com', 'securepass', '555-9876', 'Reading, Chess', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('MichaelBrown', 'michael.b@example.com', 'securepass1', '555-1111', 'Tech, Programming', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('SarahDavis', 'sarah.d@example.com', 'securepass2', '555-2222', 'Gaming, Streaming', 'Active', 'Moderator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('DavidWilson', 'david.w@example.com', 'securepass3', '555-3333', 'Sports, Fitness', 'Active', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('EmilyMartinez', 'emily.m@example.com', 'securepass4', '555-4444', 'Cooking, Blogging', 'Active', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('RobertLopez', 'robert.l@example.com', 'securepass5', '555-5555', 'Cars, Racing', 'Warning', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('JessicaTaylor', 'jessica.t@example.com', 'securepass6', '555-6666', 'Photography, Traveling', 'Active', 'Moderator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('ChristopherAnderson', 'chris.a@example.com', 'securepass7', '555-7777', 'Science, Research', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('AshleyThomas', 'ashley.t@example.com', 'securepass8', '555-8888', 'Dancing, Music', 'Suspended', 'Organizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('DanielWhite', 'daniel.w@example.com', 'securepass9', '555-9999', 'Volunteering, Social Work', 'Active', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
CALL insert_user_with_role('SophiaHarris', 'sophia.h@example.com', 'securepass10', '555-1010', 'Reading, Writing', 'Active', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserting an Administrator
CALL insert_user_with_role('BobBrown', 'bob@gmail.com', 'adminpass', '555-4321', 'N/A', 'Active', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
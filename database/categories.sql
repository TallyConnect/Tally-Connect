CREATE TABLE event_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

-- Example seed data
INSERT INTO event_categories (category_name)
VALUES 
('Music'), ('Tech'), ('Art'), ('Sports'), 
('Education'), ('Networking'), ('Health'), ('Gaming');

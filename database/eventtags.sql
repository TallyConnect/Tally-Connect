CREATE TABLE event_tags (
    event_id VARCHAR(10),
    tag_id INT,
    PRIMARY KEY (event_id, tag_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (tag_id) REFERENCES event_categories(category_id)
);

INSERT INTO event_tags (event_id, tag_id)
SELECT e.event_id, c.category_id
FROM events e
JOIN event_categories c ON e.category_name = c.category_name
WHERE e.category_name IS NOT NULL;

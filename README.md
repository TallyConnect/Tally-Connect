# Tally-Connect
## Table of Contents
- [About the Project](#about-the-project)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Data Dictionary](#data-dictionary)


# About the Project
Tally Connect is a mobile and web application aimed at enhancing the student and community experience by connecting users with local events and volunteer opportunities in the Tallahassee area. Designed with students in mind, the app enables users to easily browse, sign up for, and participate in various activities. The platform provides comprehensive event details, including descriptions, dates, times, locations, and volunteer requirements.

Event organizers can efficiently create, manage, and update their listings, streamlining the event management process while reducing administrative and marketing costs. Through Rattler Link, students and residents alike can stay informed about events in their city, and easily find ways to become more active in their local community. With a user-friendly interface, Rattler Link simplifies the process of discovering and joining events, whether for social engagement, or volunteering.


# Entity Relationship Diagram
This ERD diagram models the database structure for Tally Connect, outlining entities such as users, events, registrations, disputes, and analytics, and their relationships to support efficient event coordination and user management.

<img width="857" alt="Screenshot 2025-02-05 at 9 08 24 AM" src="https://github.com/user-attachments/assets/b2dd26e2-9908-4753-beeb-920945d056a8" />



# Data Dictionary
This data dictionary defines the structure, attributes, and constraints of the Tally Connect database.

## User Entity

| Field Name            | Data Type                          | Field Length | Constraints    | Description |
|-----------------------|-----------------------------------|--------------|---------------|-------------|
| user_id              | integer                           | 7            | Primary Key   | Auto-generated number to identify each user in the system |
| user_name            | varchar                           | 20           | Not null      | Name displayed on profile |
| user_email           | varchar                           | 50           | Not null      | Credentials used to sign up/log in |
| user_password        | varchar                           | 60           | Not null      | Password used to sign up/log in |
| user_contact_details | varchar                           | 50           | Not null      | Stores user contact information such as phone number or alternative emails |
| user_preferences     | Text                              | -            | Not null      | Stores user-selected preferences such as event categories, interests, or notification settings |
| user_status         | ENUM('Active', 'Warning', 'Suspended') | -            | Not null      | Stores whether a profile is active, on a warning, or suspended |
| user_created        | timestamp                         | 18           | -             | Stores the date and time when the user account was created |
| user_last_updated   | timestamp                         | 18           | -             | Stores the date and time when the user profile was last updated |

## User Roles Entity

| Field Name | Data Type | Field Length | Constraints   | Description |
|------------|----------|--------------|--------------|-------------|
| user_id   | integer  | 7            | Foreign Key  | Auto-generated number to identify each user in the system |
| role_name | varchar  | 20           | Not null     | Distinguish the role the user chooses |

## Events Entity

| Field Name        | Data Type | Field Length | Constraints                          | Description |
|-------------------|----------|--------------|--------------------------------------|-------------|
| event_id         | varchar  | 20           | Primary Key, Not null               | Unique identifier for each event |
| user_id          | Integer  | 7            | Foreign Key                          | The ID of the user who created the event |
| event_title      | varchar  | 100          | Not null                             | Title or name of the event |
| event_description | Text    | -            | Not null                             | Detailed description of the event |
| event_location   | varchar  | 50           | Not null                             | Address or venue of the event |
| event_date       | Date     | -            | Not null                             | Date the event is scheduled |
| event_time       | Time     | -            | Not null                             | Time the event is scheduled |
| event_status     | ENUM('Scheduled', 'Canceled', 'Completed') | - | Not null | Current status of the event |
| event_created    | Timestamp | -           | DEFAULT CURRENT_TIMESTAMP           | Date and time when the event was created |
| event_last_updated | Timestamp | -         | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Date and time when the event details were last updated |

## Event Registration Entity

| Field Name            | Data Type | Field Length | Constraints                           | Description |
|-----------------------|----------|--------------|--------------------------------------|-------------|
| registration_id      | Integer  | 10           | Primary Key                          | Unique identifier for each registration |
| event_id            | Varchar  | 20           | Foreign Key, Not null                | ID of the event being registered for |
| user_id             | Integer  | 7            | Foreign Key, Not null                | ID of the participant being registered |
| registration_status | boolean  | -            | True or False                         | Stores whether a user is registered for an event or not |
| registration_created | Timestamp | -           | DEFAULT CURRENT_TIMESTAMP            | Date and time of registration |

## Disputes Entity

| Field Name            | Data Type  | Field Length | Constraints                          | Description |
|-----------------------|-----------|--------------|--------------------------------------|-------------|
| dispute_status      | enum       | 20           | Not null                             | Informs moderator of "pending", "resolved", or "new dispute-unopened" |
| dispute_id         | integer    | 7            | Primary Key                          | Auto-generated value for the purpose of locating and associating events and disputes |
| user_id            | Integer    | 7            | Not null                             | Stores the ID of the user who raised a request, complaint, or issue |
| event_id           | Varchar    | 20           | Foreign Key                          | Unique identifier for an event |
| dispute_resolution | Text       | -            | Default null                         | Explanation of the dispute, conclusion, and recommendations |
| dispute_date_resolved | timestamp | 18           | DEFAULT CURRENT_TIMESTAMP            | Timestamp for when a dispute was resolved |

## Analytics Reports Entity

| Field Name   | Data Type | Field Length | Constraints                          | Description |
|-------------|----------|--------------|--------------------------------------|-------------|
| report_id  | Int      | 10           | Primary Key, Auto Increment         | Unique identifier for each analytics report |
| generated_by | Int    | 7            | Foreign Key, Not null               | ID of the user who generated the report |
| report_date | Timestamp | -           | DEFAULT CURRENT_TIMESTAMP           | Date and time when the report was generated |
| report_type | Enum('event', 'user profile') | - | Not null | Type of the report (e.g., user activity, event stats) |
| report_data | JSON    | -            | Nullable                             | JSON or text-based data containing report details |

## Announcements Entity

| Field Name             | Data Type | Field Length | Constraints                          | Description |
|------------------------|----------|--------------|--------------------------------------|-------------|
| announcement_id       | integer  | 7            | Primary Key                          | Unique identifier for announcement alerts |
| event_id             | varchar  | 20           | Foreign Key, Not null                | Unique identifier for each event |
| user_id              | integer  | 7            | Foreign Key, Not null                | Auto-generated number to identify each user |
| announcement_message | Text     | -            | -                                    | Message content of the announcement |
| announcement_date_posted | Timestamp | -        | DEFAULT CURRENT_TIMESTAMP            | Date and time of posting |

## Feedback Entity

| Field Name             | Data Type | Field Length | Constraints                          | Description |
|------------------------|----------|--------------|--------------------------------------|-------------|
| feedback_id          | integer  | 10           | Primary Key, Not null               | Unique identifier for each feedback report |
| event_id            | varchar  | 20           | Foreign Key, Not null                | Unique identifier for each event |
| user_id             | integer  | 7            | Foreign Key, Not null                | Unique identifier for each user reporting feedback |
| feedback_rating     | integer  | 5            | Not null                             | Rating given for event attended |
| feedback_comments   | TEXT     | -            | Nullable                             | Comments given for an event attended |
| feedback_date_submitted | Timestamp | -        | DEFAULT CURRENT_TIMESTAMP            | Date and time feedback was submitted |

## Warnings Entity

| Field Name             | Data Type | Field Length | Constraints                          | Description |
|------------------------|----------|--------------|--------------------------------------|-------------|
| warning_id          | integer  | 10           | Primary Key, Not null               | Unique identifier for each warning issued |
| user_id            | integer  | 7            | Foreign Key, Not null                | Unique identifier for each user receiving a warning |
| warning_reason     | Text     | -            | Not null                             | Reason for the warning given |
| warning_status     | Enum('yellow', 'red', 'black') | - | - | The status of the warning being given |
| warning_issued_by  | Integer  | 7            | Foreign Key, Not null                | Unique identifier for each moderator issuing a warning |
| warning_date_issued | Timestamp | -           | DEFAULT CURRENT_TIMESTAMP            | Date and time the warning was issued |
| warning_resolution | Boolean  | -            | Default false                        | Resolution for an event issued a warning |



DROP DATABASE IF EXISTS todo;
CREATE DATABASE todo;
USE todo;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

INSERT INTO tasks (description) VALUES ('My test task');
INSERT INTO tasks (description) VALUES ('My another task');

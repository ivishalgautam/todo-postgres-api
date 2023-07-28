CREATE DATABASE api;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(40) UNIQUE NOT NULL,
    password VARCHAR(40) NOT NULL
);

INSERT INTO
    users(username, password)
VALUES
    ("vishal", 1234),
    ("shubham", 1234);

CREATE TABLE todos(
    todo_id UUID DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    user_id UUID,
    PRIMARY KEY (todo_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
);

INSERT INTO
    todos (title, description, user_id)
VALUES
    (
        'todo title',
        'this my todo description',
        'b8d2c01d-4c17-4377-9724-b4af9b7fa3eb'
    );
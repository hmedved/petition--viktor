DROP TABLE IF EXISTS petition_communists;
DROP TABLE IF EXISTS communists_profiles;
DROP TABLE IF EXISTS communist;

CREATE TABLE communist(
    id SERIAL PRIMARY KEY,
    name VARCHAR(999) NOT NULL,
    surname VARCHAR(999) NOT NULL,
    email VARCHAR(999) NOT NULL UNIQUE,
    password VARCHAR(999) NOT NULL

);

CREATE TABLE petition_communists(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    communistID INTEGER
);

CREATE TABLE communists_profiles(
    id SERIAL primary key,
    age INTEGER,
    city VARCHAR(42),
    homepage VARCHAR(420),
    communistID INTEGER REFERENCES communist(id) NOT NULL UNIQUE
);

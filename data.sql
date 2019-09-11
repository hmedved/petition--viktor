DROP TABLE IF EXISTS petition_communists;
DROP TABLE IF EXISTS communists_profiles;
DROP TABLE IF EXISTS communist;
DROP TABLE IF EXISTS signup_flow;
DROP TABLE IF EXISTS signup_steps;

-- A bit revised, no need to store communist data besides id and email
CREATE TABLE communist(
    id SERIAL PRIMARY KEY,
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
    name VARCHAR(64) NOT NULL,
    surname VARCHAR(64) NOT NULL,
    age INTEGER,
    city VARCHAR(42),
    homepage VARCHAR(420),
    communistID INTEGER REFERENCES communist(id) NOT NULL UNIQUE
);

CREATE TABLE signup_steps(
  id SERIAL PRIMARY KEY,
  step VARCHAR(32)
)

INSERT  INTO signup_steps(step) VALUES ("REGISTRATION_DONE", "USER_DATA_DONE", "SIGNATURE_DONE")

CREATE TABLE signup_flow(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES communis(id) NOT NULL UNIQUE,
  signup_step_id INTEGER REFERENCES signup_steps(id)
);


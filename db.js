var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
	"postgres:postgres:postgres@localhost:5432/wintergreen-petition"
);

// Register a communist
module.exports.registerCommunist = function registerCommunist(
    email,
    password
) {
    return db.query(
        `INSERT INTO communist (
        email,
        password)
    VALUES ($1, $2)
    RETURNING id`,
        [email, password]
    );
};

// Create communist a profile
module.exports.communistProfile = function communistProfile(
    name,
    surname,
    age,
    city,
    homepage,
    id

) {
    return db.query(
        `INSERT INTO communists_profiles(name, surname, age, city, homepage, communistID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [name, surname, age, city, homepage, id]
    );
};

module.exports.communistsProfiles = function communistsProfiles() {
    return db.query(`SELECT name,
        surname, age, city, homepage, petition_communists.id
        FROM communist
        LEFT JOIN communists_profiles
        ON communist.id = communists_profiles.communistID`);
};

module.exports.getCity = function getCity(city) {
    return db.query(
        `SELECT cp.name, cp.surname, cp.age, cp.city
    FROM communist c
    LEFT JOIN communists_profiles cp
    ON communist.id = communists_profiles.communistID
    WHERE cp.city = $1`,
        [city]
    );
};

module.exports.getCommunistData = function getCommunistData(id) {
    return db.query(
        `SELECT c.email, cp.age, cp.city, cp.homepage, cp.name, cp.surname
    FROM communist c
    LEFT JOIN communists_profiles cp
    ON c.id = cp.communistID
    WHERE c.id = $1`,
        [id]
    );
};

module.exports.getCommunist = function getCommunist(signature, communistID) {
    return db.query(
        "INSERT into petition_communists(signature, communistID) VALUES ($1, $2)  RETURNING id",
        [signature, communistID]
    );
};

module.exports.getAllCommunists = function getAllCommunists() {
    return db.query(`
        SELECT name, surname, age, city, homepage
        FROM communist
        LEFT JOIN communists_profiles
        ON communist.id = communists_profiles.communistID`);
};

module.exports.getSignatures = function getSignatures(communistID) {
    return db.query(
        "SELECT signature FROM petition_communists WHERE communistID = $1",
        [communistID]
    );
};

module.exports.checkSignature = function checkSignature(id) {
    return db.query(
        "SELECT id FROM petition_communists WHERE communistID = $1",
        [id]
    );
};

module.exports.deleteSignature = function deleteSignature(id) {
    return db.query(
        `DELETE FROM petition_communists
        WHERE communistID = $1`,
        [id]
    );
};

module.exports.checkEmail = function checkEmail(email) {
    return db.query(`SELECT password, id FROM communist WHERE email = $1`, [
        email
    ]);
};

module.exports.checkPassword = function checkPassword(password) {
    return db.query(`SELECT email, id FROM communist WHERE password = $1`, [
        password
    ]);
};

module.exports.whoSigned = function whoSigned(signature, id) {
    return db.query(
        "INSERT INTO petition_communists (signature, communistID) VALUES ($1, $2) RETURNING id",
        [signature, id]
    );
};

module.exports.updateCommunistWithPassword = function updateCommunistWithPassword(
    email,
    password,
    id
) {
    return db.query(
        `UPDATE communist
    SET email= $1 , password = $2
    WHERE id = $3`,
        [email, password, id]
    );
};

module.exports.updateCommunistWithoutPassword = function updateCommunistWithoutPassword(
    email,
    id
) {
    return db.query(
        `UPDATE communist
    SET email = $1
    WHERE id = $2`,
        [email, id]
    );
};

module.exports.updateCommunist_Profile = function updateCommunist_Profile(
    name,
    surname,
    age,
    city,
    homepage,
    id
) {
    return db.query(
        `
        UPDATE communists_profiles
        SET name = $1, surname = $2, age = $3, city = $4, homepage = $5
        WHERE communistID = $6;`,
        [name, surname, age, city, homepage, id]
    );
};

// SIGNUP FLOW QUERIES

module.exports.initCommnistSignup = function initCommnistSignup(communistId) {
    return db.query(`
      INSERT INTO signup_flow(user_id, signup_step_id)
      VALUES($1, ( SELECT id FROM signup_steps WHERE step = 'REGISTRATION_DONE')); `, [communistId]
    );
};

module.exports.getCommunistSignup = function getCommunistSignup(communistId) {
    return db.query(`
      SELECT signup_steps.step
      FROM signup_steps
      INNER JOIN signup_flow ON signup_flow.signup_step_id = signup_step.id
      INNER JOIN communist ON communist.id = signup_flow.user_id
      WHERE communis.id = $1`, [communistId]
    );
};

module.exports.updateCommunistSignup = function updateCommunistSignup(communistId, signup_step) {
    return db.query(`
      UPDATE signup_flow
      SET signup_step_id = (
        SELECT id FROM signup_steps WHERE step = $1::text
      )
      WHERE signup_flow.user_id = $2`, [signup_step, communistId]
    );
};

module.exports.checkSignupStep = function checkSignupStep(communistId) {
    return db.query(`
      SELECT step
		FROM signup_steps
		INNER JOIN signup_flow ON signup_flow.signup_step_id = signup_steps.id
		WHERE signup_flow.user_id = $1`, [communistId]);
};

// EXAMPLE QUERIES TO GET COMMUNIST DATA

/*
    SELECT cp.name, cp.surname, cp.age, cp.city, cp.homepage
    FROM communist_profiles cp
    INNER JOIN communist c ON c.id = cp.communistID
    where c.id = $1, // $1 is the input param, i.e. the communist id
    the same you could use to search by name, city, homepage, etc...
    the main difference is that with id, you should have only 1 result, i.e. only one communist
    with the other search criteria you could have multiple results
*/

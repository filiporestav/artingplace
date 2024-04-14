import sqlite3 from "sqlite3";
import { promisify } from "util";
import { resolvePath } from "./util.js";

sqlite3.verbose(); // Enable debug mode
const filepath = resolvePath("server/src/data.sqlite");

const db = new sqlite3.Database(filepath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the datasbase");
  }
});

// Used to promisify db queries
// const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));

// Function to reset the database tables
async function resetTables() {
  const delUserTable = `DROP TABLE IF EXISTS users`;
  await dbRun(delUserTable);
  const delPaintingsTable = `DROP TABLE IF EXISTS paintings`;
  await dbRun(delPaintingsTable);
  const delLikesTable = `DROP TABLE IF EXISTS user_likes`;
  await dbRun(delLikesTable);
}

// await resetTables()

// We have a one-to-many relationship
// One user can have multiple paintings, but one painting can only have one artist

// the "one" side
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT NOT NULL,
    avatar BLOB,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
)`;

await dbRun(createUserTable);

// the "many" side
const createPaintingsTable = `
CREATE TABLE IF NOT EXISTS paintings (
    painting_id TEXT UNIQUE PRIMARY KEY,
    name TEXT,
    price INTEGER NOT NULL,
    likes INTEGER DEFAULT 0,
    user_id TEXT NOT NULL,
    image BLOB,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
)`;

await dbRun(createPaintingsTable);

// Create junction table to store likes
const createLikesTable = `
CREATE TABLE IF NOT EXISTS user_likes (
    user_id TEXT,
    painting_id TEXT,
    PRIMARY KEY (user_id, painting_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (painting_id) REFERENCES paintings (painting_id)
);`;

await dbRun(createLikesTable);

export default db;

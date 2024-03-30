import sqlite3 from 'sqlite3'
import { resolvePath } from './util.js'

sqlite3.verbose() // Enable debug mode
const filepath = resolvePath("server/src/data.sqlite")

const db = new sqlite3.Database(filepath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message)
    }
    else {
        console.log('Connected to the datasbase')
    }
})

// Function to reset the database tables
function resetTables() {
    const delUserTable = `DROP TABLE IF EXISTS users`
    db.run(delUserTable)
    const delPaintingsTable = `DROP TABLE IF EXISTS images`
    db.run(delPaintingsTable)
}

// We have a one-to-many relationship
// One user can have multiple paintings, but one painting can only have one artist

// the "one" side
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    artist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT NOT NULL
)`

db.run(createUserTable, (err) => {
    if (err) console.error(err.message)
    else console.log("User table created successfully");
})

// the "many" side
const createImgTable = `
CREATE TABLE IF NOT EXISTS paintings (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    data TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES users (artist_id)
)`

db.run(createImgTable, (err) => {
    if (err) console.error(err.message)
    else console.log("Image table created successfully");
})

export default db
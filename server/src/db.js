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

// const delTable = `DROP TABLE IF EXISTS users`
// db.run(delTable)

const createTable = `
CREATE TABLE IF NOT EXISTS users (
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT NOT NULL
)`

db.run(createTable, (err) => {
    if (err) console.error(err.message)
    else console.log("Table created successfully");
})

export default db
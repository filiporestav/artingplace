import { v4 as uuidv4 } from 'uuid'
import User from './models/user.model.js'
import Painting from './models/painting.model.js'
import db from './db.js'

class Model {
    constructor() {
        this.paintings = {}
        this.users = {}
        this.io = undefined
    }

    /**
     * Initialize the model after its creation
     * @param {SocketIO.Server} io - The socket.io server instance
     * @returns {void} 
     */
    init(io) {
        this.io = io
    }

    /**
     * Adds a painting to the server.
     * @param {String} title - Name of the painting (Noname if empty)
     * @param {String} artist - Name of the artist (Unknown if empty)
     * @returns {void}
     */
    addPainting(title="Noname", artist="Unknown", paintingId = uuidv4()) {
        this.paintings[paintingId] = new Painting(title, artist)
    }

    /**
     * Adds a user to the model
     * @param {String} id - The id of the session (unique)
     * @param {String} name - Name of the user
     * @returns {void}
     */
    addUser(id, name) {
        this.users[id] = new User(name)
    }

    /**
     * Finds an user by its ID.
     * @param {String} id - The id of the session (unique)
     * @returns {User}
     */
    findUserById(id) {
        return this.users[id]
    }

    /**
     * Checks if a user with a given email exists.
     * @param {String} email - The email of the account (unique)
     * @returns {Promise<Boolean>} - A Promise that resolves to true/false if an account exists with the email
     */
    emailExists(email) {
        return new Promise((resolve, reject) => {
            const checkEmailStatement = `SELECT * FROM users WHERE email = ?`;
            db.get(checkEmailStatement, email, (err, row) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(!!row); // Convert row to a boolean value
                }
            });
        });
    }

    /**
     * Gets the username of a user based on email.
     * @param {String} email - The email of the account (unique)
     * @returns {Promise<String>} - A Promise that resolve the username corresponding to the email
     */
    getUsernameFromEmail(email) {
        return new Promise((resolve, reject) => {
            const checkEmailStatement = `SELECT * FROM users WHERE email = ?`;
            db.get(checkEmailStatement, email, (err, row) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(row.username)
                    resolve(row.username); // Return the username
                }
            });
        });
    }

    /**
     * Checks if a user with a given email and password exists.
     * @param {String} email - The email of the account (unique)
     * @param {String} password - The password (unhashed)
     * @returns {Promise<Boolean>} - A Promise that resolves to true/false if an account exists with the email and password
     */
    correctCredentials(email, password) {
        return new Promise((resolve, reject) => {
            const checkEmailAndPasswordStatement = `SELECT * FROM users WHERE email = ? AND password = ?`;
            db.get(checkEmailAndPasswordStatement, [email, password], (err, row) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(!!row); // Convert row to a boolean value
                }
            });
        });
    }

    /**
     * Checks if a user with a given username exists.
     * @param {String} username - The username to check
     * @returns {Promise<Boolean>} - A Promise that resolves to true/false if an account exists with the username
     */
    usernameExists(username) {
        return new Promise((resolve, reject) => {
            const checkUsernameStatement = `SELECT * FROM users WHERE username = ?`;
            db.get(checkUsernameStatement, username, (err, row) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(!!row); // Convert row to a boolean value
                }
            });
        });
    }
}

export default new Model()
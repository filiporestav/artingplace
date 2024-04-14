import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import db from '../db.js'

const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));

class User {
    constructor(username, email, password) {
        this.userId = uuidv4()
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = new Date().toISOString();
    }

    async save() {
        try {
            // Check if email or username is already taken
            const userExists = await dbGet(
                `SELECT * FROM users WHERE email = ? OR username = ?`,
                [this.email, this.username]
            );
            if (userExists) {
                if (userExists.email === this.email) {
                    throw new Error("Email is already in use");
                }
                if (userExists.username === this.username) {
                    throw new Error("Username is already taken");
                }
            }
            // Hash password before inserting it in database
            const hashedPassword = await bcrypt.hash(this.password, 10);

            // Create the new user in the database
            await dbRun(
                `INSERT INTO users (user_id, email, username, password, createdAt) VALUES (?, ?, ?, ?, ?)`,
                [this.userId, this.email, this.username, hashedPassword, this.createdAt]
            );
            console.log("Registration successful!")
            return { success: true, message: "Registration successful!", cookie: this.userId};
        } catch (error) {
            console.error(error);
            return { success: false, message: "Could not register user" };
        }
    }

    static async login(email, password) {
        try {
            const user = await dbGet(`SELECT * FROM users WHERE email = ?`, [email]);
            console.log("Email:", email)
            if (!user) {
                console.log("Email was not found in database");
                return { authenticated: false, message: "An account with the email does not exist" };
            }

            const credentialsCorrect = await bcrypt.compare(password, user.password);
            if (!credentialsCorrect) {
                console.log("Invalid password");
                return { authenticated: false, message: "Invalid email or password" };
            }

            console.log("Correct credentials!");
            return {
                authenticated: true,
                userId: user.user_id,
                username: user.username,
                message: "Correct credentials!"
            };
        } catch (error) {
            console.error("Error during user login:", error);
            return { authenticated: false, message: "Internal Server Error" };
        }
    }

    static async findByUserId(userId) {
        const user = await dbGet(`SELECT * FROM users where user_id = ?`, [userId])
        return user // Returns user object if defined, otherwise undefined
    }

    static async findByUsername(username) {
        const user = await dbGet(`SELECT * FROM users WHERE username = ?`, [username])
        return user // Returns user object if defined, otherwise undefined
    }

    static async findByEmail(email) {
        const user = await dbGet(`SELECT * FROM users WHERE username = ?`, [email])
        return user // Returns user object if defined, otherwise undefined
    }
}

export default User
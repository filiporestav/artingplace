import { Router } from 'express'
import model from '../model.js'
import db from '../db.js'
import { v4 as uuidv4 } from 'uuid' // Used to generate random IDs for every user
import { promisify } from 'util'
import bcrypt from 'bcrypt'

const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const router = Router()

/**
 * requireAuth is a middleware function that limit access to an endpoint to authenticated users.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
    const { id } = req.session
    const user = model.findUserById(id)
    console.log("User found with ID: ", id)
    console.log("User found: ", user)

    if (!user && req.startsWith("/api")) {
        res.status(401).end()
    }
    else {
        next()
    }
}

// API endpoint for User Login
router.post("/user", async (req, res) => {
    const { email, password } = req.body;
    /* 
    console.log("Got user login request");
    console.log(email);
    console.log(password);
    */ 

    try {
        const user = await dbGet(`SELECT * FROM users WHERE email = ?`, email)
        if (!user) {
            console.log("Email was not found in database");
            return res.status(404).send({authenticated: false, message: "An account with the email does not exist"});
        }
        const credentialsCorrect = await bcrypt.compare(password, user.password)
        console.log(credentialsCorrect)
        if (!credentialsCorrect) {
            console.log("Invalid password");
            return res.status(401).send({authenticated: false, message: "Invalid email or password"});
        }

        console.log("Correct credentials!");
        model.addUser(user.user_id, user.username); // Add the client cookie as an identifier for the session
        res.cookie("niceCookie", user.user_id)
        return res.status(201).send({authenticated: true, username: user.username, message: "Correct credentials!"});
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).send({authenticated: false, message: "Internal Server Error"});
    }
});

// Middleware for validation
const validateRegistration = (req, res, next) => {
    const { password, confirmedPassword } = req.body;
    if (password !== confirmedPassword) {
        return res.status(400).send({ message: "Password and confirmed password do not match" });
    }
    next();
};

// API endpoint for User registration
router.put("/user", validateRegistration, async (req, res) => {
    const { email, username, password } = req.body;
    console.log(email + username + password)
    try {
        // Check if email or username is already taken
        const userExists = await dbGet(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username]);
        if (userExists) {
            if (userExists.email === email) {
                return res.status(409).send({ message: "Email is already in use" });
            }
            if (userExists.username === username) {
                return res.status(409).send({ message: "Username is already taken" });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user_id = uuidv4();
        await dbRun(`INSERT INTO users (user_id, email, username, password) VALUES (?, ?, ?, ?)`, [user_id, email, username, hashedPassword]);

        console.log("Registration successful!");
        res.status(201).send({ message: "Registration successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Could not register user" });
    }
});


// API endpoints for User logout
router.delete("/user", (req, res) => {
    const id = req.cookies.niceCookie
    const user = model.findUserById(id)
    if (user) {
        console.log("Found valid user when signing out.")
        res.clearCookie('niceCookie')
        res.status(200).send({signedOut: true})
    }
    else res.status(405).send({signedOut: false}) // 405 Method Not Allowed returned if no user found with the id
})

export default { router, requireAuth }
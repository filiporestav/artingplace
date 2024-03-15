import { Router } from 'express'
import model from '../model.js'
import db from '../db.js'

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
    console.log("Got user login request");
    console.log(email)
    console.log(password)

    // If email not in database
    model.emailExists(email)
    .then(emailExists => {
        if (!emailExists) {
            console.log("Email was not found in database");
            return res.status(404).send({authenticated: false, message: "An account with the email does not exist"});
        } else {
            console.log("Email found in db")
        }
    })
    .catch(error => {
        console.error("Error checking email existence:", error);
        return res.status(500).send({authenticated: false, message: "Internal Server Error"});
    });

    // Check if credentials are correct
    model.correctCredentials(email, password)
    .then(credentialsCorrect => {
        if (!credentialsCorrect) {
            console.log("Invalid password");
            return res.status(401).send({authenticated: false, message: "Invalid email or password"});
        } else {
            console.log("Correct credentials!");

            model.getUsernameFromEmail(email)
            .then(username => {
                return res.status(201).send({authenticated: true, username: username, message: "Correct credentials!"})
            })
        }
    })
});


// API endpoint for User registration
router.put("/user", async (req, res) => {
    const { email, username, password, confirmedPassword } = req.body;
    console.log("Received PUT req");
    console.log("Email", email);
    console.log("Username", username);
    console.log("Password", password);
    console.log("Confirmed Password", confirmedPassword);
    if (password !== confirmedPassword) {
        return res.status(400).send({message: "Password and confirmed password do not match"});
    }

    try {
        const checkEmailResult = await new Promise((resolve, reject) => {
            const checkAvailableEmailStatement = `SELECT * FROM users WHERE email = ?`;
            db.get(checkAvailableEmailStatement, email, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (checkEmailResult) {
            console.log("Email is already in use");
            return res.status(409).send({message: "Email is already in use"});
        }

        const checkUsernameResult = await new Promise((resolve, reject) => {
            const checkAvailableUsernameStatement = `SELECT * FROM users WHERE username = ?`;
            db.get(checkAvailableUsernameStatement, username, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (checkUsernameResult) {
            console.log("Username is taken");
            return res.status(409).send({message: "Username is already taken"});
        }

        // Create the new user
        await new Promise((resolve, reject) => {
            const createNewUserStatement = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;
            db.run(createNewUserStatement, [email, username, password], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        console.log("Registration successful!");
        return res.status(201).send({message: "Registration successful!"});

    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Could not register user"});
    }
});


// API endpoints for User logout
router.delete("/user", (req, res) => {
    const { id } = req.session
    console.log(id)
})

export default { router, requireAuth }
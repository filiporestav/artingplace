import { Router } from "express";
import multer from "multer";
import { promisify } from "util";

import db from "../db.js";
import User from '../models/user.model.js'

const dbGet = promisify(db.get.bind(db));
const router = Router();

/**
 * requireAuth is a middleware function.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
  const userId = req.cookies.niceCookie
  const user = User.findByUserId(userId)
  if (user) {
    next();
  }
  else {
    res.status(403).send()
    // next("/login") // If trying to access admin endpoint without being admin, redirect to login
  }
};

// Middleware for validation of passwords
const validatePasswords = (req, res, next) => {
  const { password, confirmedPassword } = req.body;
  if (password !== confirmedPassword) {
    return res.status(400).send("Password and confirmed password do not match");
  }
  return next();
};

router.get("/isLoggedIn", async (req, res) => {
  const cookie = req.cookies.niceCookie
  if (cookie) {
    const user = await User.findByUserId(cookie) // Check if user exists in database
    res.status(200).send({
      cookie: user.user_id,
      username: user.username,
  });
  }
  else res.status(401).send("You are not logged in");
})

router.delete("/profile", requireAuth, async (req, res) => {
  const cookie = req.cookies.niceCookie
  const result = await User.deleteById(cookie)
  if (result.success) {
    res.status(200).json(result.message)
  }
  else {
    res.status(500).json(result.message)
  }
})

// Change email
router.patch("/email", async (req, res) => {
  const cookie = req.cookies.niceCookie
  const { newEmail } = req.body
  if (cookie) {
    const result = await User.changeEmailById(cookie, newEmail)
    if (result.success) {
      res.status(200).json(result.message)
    }
    else {
      res.status(500).json(result.message)
    }
  }
})

// Change password
router.patch("/password", validatePasswords, async (req, res) => {
  const cookie = req.cookies.niceCookie
  const { oldPassword, password } = req.body
  // Check if previous password is correct
  const prevPasswordResult = await User.checkPassword(cookie, oldPassword)
  if (prevPasswordResult.success) {
    const result = await User.changePasswordById(cookie, password)
    if (result.success) {
      res.status(200).json(result.message)
    }
    else {
      res.status(500).json(result.message)
    }
  }
  else {
    res.status(401).json(prevPasswordResult.message)
  }
})

// API endpoint for User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const result = await User.login(email, password);
  if (result.authenticated) {
      res.cookie("niceCookie", result.userId);
      const user = await User.findByUserId(result.userId)
      req.session.user = { // Save user session
        username: user.username,
        cookie: user.user_id
      }
      res.status(200).send({
          cookie: result.userId,
          username: result.username,
          message: result.message
      });
  } else {
      res.status(401).send({ message: result.message });
  }
});

// API endpoint for User registration
router.post("/register", validatePasswords, async (req, res) => {
  const { email, username, password } = req.body;
  const newUser = new User(username, email, password)
  console.log(newUser)
  const result = await newUser.save()
  console.log(result)
  if (result.success) {
    res.status(201).json({message: result.message, cookie: result.cookie})
  }
  else {
    res.status(500).json({message: result.message})
  }
});

// API endpoints for User logout
router.delete("/user", requireAuth, (req, res) => {
  const id = req.cookies.niceCookie;
  const user = dbGet("SELECT * FROM users WHERE user_id = ?", id);
  if (user) {
    console.log("Found valid user when signing out.");
    res.clearCookie("niceCookie");
    res.status(200).send();
  } else res.status(405).send(); // 405 Method Not Allowed returned if no user found with the id
});

export default { router, requireAuth };

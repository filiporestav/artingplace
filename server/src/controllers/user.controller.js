import { Router } from "express";
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
  if (req.session.user) {
    next();
  }
  else {
    res.status(403).send()
    // next("/login") // If trying to access admin endpoint without being admin, redirect to login
  }
};

// API endpoint for User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Email in router:", email)

  const result = await User.login(email, password);
  if (result.authenticated) {
      res.cookie("niceCookie", result.userId);
      res.status(200).send({
          cookie: result.userId,
          username: result.username,
          message: result.message
      });
  } else {
      res.status(401).send({ message: result.message });
  }
});

// Middleware for validation
const validateRegistration = (req, res, next) => {
  const { password, confirmedPassword } = req.body;
  if (password !== confirmedPassword) {
    return res.status(400).send("Password and confirmed password do not match");
  }
  return next();
};

// API endpoint for User registration
router.post("/register", validateRegistration, async (req, res) => {
  const { email, username, password } = req.body;
  const newUser = new User(username, email, password)
  const result = await newUser.save()
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

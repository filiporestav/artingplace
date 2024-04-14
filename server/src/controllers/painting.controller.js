import { Router } from "express";
import multer from "multer";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";
import Painting from "../models/painting.model.js"
import User from "../models/user.model.js"

const router = Router();
const upload = multer();
const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

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

// Endpoint to upload a painting and its image
router.post("/painting", requireAuth, upload.single("image"), async (req, res) => {
  const { paintingName, paintingPrice } = req.body;
  const image = req.file;
  const userId = req.cookies.niceCookie;

  try {
    const painting = new Painting(paintingName, paintingPrice, image, userId);
    await painting.save();
    res.status(200).send("Painting uploaded successfully");
  } catch (error) {
    console.error("Error uploading painting:", error);
    res.status(500).send("Error uploading painting");
  }
});

router.get("/paintings", async (req, res) => {
  try {
    const paintings = await Painting.getAllPaintingsWithDetails();
    res.status(200).json(paintings);
  } catch (error) {
    console.error("Error fetching paintings:", error);
    res.status(500).send("Error fetching paintings");
  }
});

// Get all paintings from a specific user with a specific cookie
router.get("/myPaintings", requireAuth, async (req, res) => {
  const userId = req.cookies.niceCookie;
  try {
    const paintings = await Painting.getUserPaintingsWithFeaturedImages(userId)
    res.status(200).json(paintings) // Send all paintings to client
  }
  catch (error) {
    console.error("Error fetching user paintings:", error)
    res.status(500).send("Error fetching paintings")
  }
});

// Get the contact info (from user table) from a specific painting ID
router.get("/painting/:paintingId", async (req, res) => {
  const { paintingId } = req.params;
  const painting = Painting.findById(paintingId)

  if (!painting) {
    res.status(404).send(`Painting with painting ID ${paintingId} not found`)
  }
  const user = User.findById(painting.userId)

  if (!user) {
    res.status(404).send(`User with user ID ${user.userId} not found`)
  }
  res.status(200).json({ painting })
});

// Get all the images for a specific painting ID
router.get("/painting/images/:paintingId", async (req, res) => {
  const { paintingId } = req.params;
  await Painting.getImagesByPaintingId(paintingId, res);
});

router.post("/like/:paintingId", requireAuth, async (req, res) => {
  const { paintingId } = req.params;
  const userId = req.cookies.niceCookie;

  const result = await Painting.likePainting(paintingId, userId);

  if (result.success) {
      res.status(200).json(result.likes);
  } else {
      res.status(405).send(result.message);
  }
});

export default { router, requireAuth };

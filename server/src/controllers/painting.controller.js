import { Router } from "express";
import multer from "multer";
import Painting from "../models/painting.model.js"
import User from "../models/user.model.js"

const router = Router();
const upload = multer();

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
  }
};

// Endpoint to upload a painting and its image
router.post("/painting", requireAuth, upload.single("image"), async (req, res) => {
  const { paintingName, paintingPrice } = req.body;
  const image = req.file.buffer;
  const userId = req.cookies.niceCookie;

  try {
    const painting = new Painting(paintingName, paintingPrice, image, userId);
    await painting.save();
    res.status(200).send({ painting, message: "Painting uploaded successfully"});
  } catch (error) {
    console.error("Error uploading painting:", error);
    res.status(500).send("Error uploading painting");
  }
});

router.get("/paintings", async (req, res) => {
  try {
    const paintings = await Painting.getPaintings()
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

// Get image from the painting id, return it in Blob format
router.get("/image/:paintingId", async (req, res) => {
  const { paintingId } = req.params;
  const imageData = await Painting.getImageData(paintingId);

  if (!imageData || !imageData.image) {
    return res.status(404).send('Image not found');
  }

  res.setHeader('Content-Type', 'image/jpeg');
  return res.send(imageData.image);
});

// Get the painting info
router.get("/painting/:paintingId", async (req, res) => {
  const { paintingId } = req.params;
  const painting = await Painting.findById(paintingId)
  // console.log("Painting:", painting)
  const owner = await User.findByUserId(painting.user_id)
  console.log("User:", owner)

  if (!painting) {
    res.status(404).send(`Painting with painting ID ${paintingId} not found`)
  }
  res.status(200).json({ painting, owner })
});

router.post("/like/:paintingId", requireAuth, async (req, res) => {
  const { paintingId } = req.params;
  const userId = req.cookies.niceCookie;

  const result = await Painting.like(paintingId, userId);

  if (result.success) {
      res.status(200).send(result.message);
  } else {
      res.status(405).send(result.message);
  }
});

export default { router, requireAuth };

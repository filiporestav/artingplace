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
  const userId = req.cookies.niceCookie
  const user = User.findByUserId(userId)
  if (user) {
    next();
  }
  else {
    res.status(403).send()
  }
};

// Check if stored listing is in database
router.get("/checkPreviousPaintingSession", async (req, res) => {
  const paintingSessionId = req.cookies.latestPaintingId
  if (paintingSessionId) {
    const painting = await Painting.findById(paintingSessionId, 0) // Check for unposted paintings
    if (painting) res.status(200).send(painting)
    else res.status(404).send("No previous unlisted painting found")
  }
  else res.status(404).send("No previous painting listing session found")
})

// Endpoint to upload a painting and its image
router.post("/painting", requireAuth, upload.single("image"), async (req, res) => {
  const { paintingName, paintingPrice, paintingDescription } = req.body;
  const image = req.file.buffer;
  const userId = req.cookies.niceCookie;
  const prevPaintingId = req.cookies.latestPaintingId

  try {
    if (prevPaintingId) {
      await Painting.post(prevPaintingId) // Make the painting posted
    }
    else {
      const painting = new Painting(paintingName, paintingPrice, paintingDescription, image, userId);
      await painting.save();
      await Painting.post(painting.paintingId)
      console.log("Painting saved")
    }
    res.clearCookie("latestPaintingId") // Clear the painting ID tracker
    res.status(200).send({ message: "Painting uploaded successfully"});
  } catch (error) {
    console.error("Error uploading painting:", error);
    res.status(500).send("Error uploading painting");
  }
});

// Endpoint to save current data from client
router.post("/saveChanges", requireAuth, upload.single("image"), async (req, res) => {
  const { paintingName, paintingPrice, paintingDescription } = req.body;
  let image = null // Change if image is appended
  if (req.file) {
    image = req.file.buffer;
  }
  const userId = req.cookies.niceCookie;
  const prevPaintingId = req.cookies.latestPaintingId
  console.log("prevPaintingId:", prevPaintingId)

  try {
    // If no previous painting id
    if (!prevPaintingId) {
      console.log("No painting ID found, creating new painting...")
      const painting = new Painting(paintingName, paintingPrice, paintingDescription, image, userId);
      const { paintingId } = painting
      res.cookie("latestPaintingId", paintingId) // Set cookie to the browser to remember this painting
      await painting.save(); // Insert it in database
      res.status(200).send({ painting, message: "Painting created and saved successfully"});
    }
    else {
      console.log("Painting ID found.")
      const painting = await Painting.findById(prevPaintingId, 0) // Find unlisted painting
      if (painting) {
        console.log("Found unlisted painting.")
        // Update the painting info of this painting
        await Painting.updateInfo(prevPaintingId, userId, paintingName, paintingPrice, paintingDescription, image)
        res.status(200).send({ painting, message: "Painting saved successfully"});
      }
      else res.status(404).send("No unlisted painting find with this ID")
    }
  } catch (error) {
    console.error("Error saving painting:", error);
    res.status(500).send("Error saving painting");
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
    const paintings = await Painting.findByUserId(userId)
    console.log(paintings)
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

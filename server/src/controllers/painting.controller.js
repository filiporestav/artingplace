import { Router } from "express";
import multer from "multer";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

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
  next();
};

// Endpoint to upload a painting and its images
router.post("/painting", upload.array("images", 5), async (req, res) => {
  const { paintingName, paintingPrice } = req.body;
  const images = req.files;
  const userId = req.cookies.niceCookie;
  const paintingId = uuidv4(); // Unique ID for the painting

  try {
    // Insert all images into the 'images' table
    images.forEach(async (image) => {
      const imageId = uuidv4();
      await dbRun(
        "INSERT INTO images (image_id, data, painting_id) VALUES (?, ?, ?)",
        [imageId, image.buffer, paintingId],
      );
    });

    // Let the first image from the painting be the featured image
    const firstImage = await dbGet(
      `SELECT * FROM images WHERE painting_id = ? LIMIT 1`,
      paintingId,
    );
    const featuredImageId = firstImage.image_id;

    // Update the 'paintings' table with the painting, and the selected featured image ID
    await dbRun(
      "INSERT INTO paintings (painting_id, name, price, user_id, featured_image_id) VALUES (?, ?, ?, ?, ?)",
      [paintingId, paintingName, paintingPrice, userId, featuredImageId],
    );

    res.status(200).send("Painting upload successful");
  } catch (error) {
    console.error("Error uploading painting:", error);
    res.status(500).send("Error uploading painting");
  }
});

router.get("/paintings", async (req, res) => {
  try {
    const paintings = await dbAll(`SELECT * FROM paintings`); // Get all paintings
    const updatedPaintings = await Promise.all(
      paintings.map(async (painting) => {
        const featuredImage = await dbGet(
          `SELECT data FROM images WHERE image_id = ? LIMIT 1`,
          painting.featured_image_id,
        );
        const createdBy = await dbGet(
          `SELECT username FROM users WHERE user_id = ? LIMIT 1`,
          painting.user_id,
        );
        return {
          ...painting,
          username: createdBy.username,
          featuredImageData: featuredImage.data,
        };
      }),
    );
    res.status(200).json(updatedPaintings);
  } catch (error) {
    console.error("Error fetching paintings:", error);
    res.status(500).send("Error fetching paintings");
  }
});

// Get all paintings from a specific user with a specific cookie
router.get("/myPaintings", async (req, res) => {
  const userId = req.cookies.niceCookie;
  try {
    const userPaintings = await dbAll(
      `SELECT * FROM paintings WHERE user_id = ?`,
      userId,
    );

    // Use map to iterate over userPaintings and create a promise for each painting's additional data fetching
    const paintingPromises = userPaintings.map(async (painting) => {
      const featuredImage = await dbGet(
        `SELECT data FROM images WHERE image_id = ? LIMIT 1`,
        painting.featured_image_id,
      );
      // Return a new object that includes all properties of the original painting plus the new featuredImageData
      return {
        ...painting,
        featuredImageData: featuredImage.data,
      };
    });

    // Wait for all promises to resolve
    const updatedPaintings = await Promise.all(paintingPromises);

    res.status(200).json(updatedPaintings);
  } catch (error) {
    console.error("Error fetching paintings:", error);
    res.status(500).send("Error fetching paintings");
  }
});

// Get the painting info from a specific painting ID
router.get("/painting/:paintingId", async (req, res) => {
  const { paintingId } = req.params;
  try {
    const painting = await dbGet(
      `SELECT * FROM paintings WHERE painting_id = ?`,
      paintingId,
    );
    if (painting) {
      const user = await dbGet(
        `SELECT * FROM users WHERE user_id = ?`,
        painting.user_id,
      );
      painting.email = user.email;
      painting.username = user.username;
      res.status(200).json(painting);
    } else {
      res.status(404).send(`Painting with painting ID ${paintingId} not found`);
    }
  } catch (error) {
    console.error(
      `Error fetching painting with painting ID ${paintingId}:`,
      error,
    );
    res.status(500).send("Error fetching painting");
  }
});

// Get all the images for a specific painting ID
router.get("/painting/images/:paintingId", async (req, res) => {
  const { paintingId } = req.params;
  try {
    const imagesInBlob = await dbAll(
      `SELECT data FROM images WHERE painting_id = ?`,
      paintingId,
    );

    // Set the appropriate Content-Type header for the response
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });

    // Write all images to the response
    imagesInBlob.forEach((image) => {
      res.write(image.data, "binary"); // Write the image data
    });

    res.end(); // End response after writing all images
  } catch (error) {
    console.error(
      `Error fetching images with painting ID ${paintingId}:`,
      error,
    );
    res.status(500).send("Error fetching images");
  }
});

router.post("/like/:paintingId", async (req, res) => {
  const { paintingId } = req.params;
  const userCookie = req.cookies.niceCookie;
  const userExists = await dbGet(
    `SELECT * FROM users WHERE user_id = ?`,
    userCookie,
  );
  if (userExists) {
    // Check if trying to like their own painting
    const myOwnPaintings = await dbGet(
      `SELECT * FROM paintings WHERE painting_id = ? AND user_id = ?`,
      [paintingId, userCookie],
    );

    // Check if user already has liked this painting
    const alreadyLiked = await dbGet(
      `SELECT * FROM user_likes WHERE user_id = ? AND PAINTING_id = ?`,
      [userCookie, paintingId],
    );

    if (myOwnPaintings)
      res.status(405).send("Could not like your own painting");
    else if (alreadyLiked)
      res.status(405).send("You have already likes this painting");
    else {
      // Insert the likes in the user_likes table
      await dbRun(
        `INSERT INTO user_likes (user_id, painting_id) VALUES (?, ?)`,
        [userCookie, paintingId],
      );
      // Update the likes by 1 in the paintings table
      await dbRun(
        `UPDATE paintings SET likes = likes + 1 WHERE painting_id = ?`,
        paintingId,
      );
      const likes = await dbGet(
        `SELECT likes FROM paintings WHERE painting_id = ?`,
        paintingId,
      );
      res.status(200).json(likes);
    }
  }
});

export default { router, requireAuth };

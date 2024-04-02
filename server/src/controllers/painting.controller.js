import { Router } from 'express'
import model from '../model.js'
import db from '../db.js'
import multer from 'multer'
import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid'
import { Buffer } from 'buffer'

const router = Router()
const upload = multer()
const dbGet = promisify(db.get.bind(db))
const dbRun = promisify(db.run.bind(db))
const dbAll = promisify(db.all.bind(db))

/**
 * requireAuth is a middleware function.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
    next()
}

// Endpoint to upload a painting and its images
router.post('/painting', upload.array('images', 5), async (req, res) => {
    const { painting_name, painting_price } = req.body;
    const images = req.files;
    const user_id = req.cookies.niceCookie;
    const paintingId = uuidv4(); // Unique ID for the painting

    try {
        // Insert all images into the 'images' table
        for (const image of images) {
            const imageId = uuidv4()
            await dbRun('INSERT INTO images (image_id, data, painting_id) VALUES (?, ?, ?)', [imageId, image.buffer, paintingId]);
        }

        // Let the first image from the painting be the featured image
        const firstImage = await dbGet(`SELECT * FROM images WHERE painting_id = ? LIMIT 1`, paintingId)
        const featured_image_id = firstImage.image_id
       
        // Update the 'paintings' table with the painting, and the selected featured image ID
        await dbRun('INSERT INTO paintings (painting_id, name, price, user_id, featured_image_id) VALUES (?, ?, ?, ?, ?)',
                     [paintingId, painting_name, painting_price, user_id, featured_image_id]);

        res.send('Painting and images uploaded successfully');
    } catch (error) {
        console.error('Error uploading painting:', error);
        res.status(500).send('Error uploading painting');
    }
});


router.get("/paintings", async (req, res) => {
    try {
        const paintings = await dbAll(`SELECT * FROM paintings`); // Get all paintings
        for (const painting of paintings) {
            const featuredImage = await dbGet(`SELECT data FROM images WHERE image_id = ? LIMIT 1`, painting.featured_image_id)
            const createdBy = await dbGet(`SELECT username FROM users WHERE user_id = ? LIMIT 1`, painting.user_id)
            painting.username = createdBy.username
            painting.featuredImageData = featuredImage.data // Send the photo (bulb) as well
        }
        res.status(200).json(paintings);
    } catch (error) {
        console.error("Error fetching paintings:", error);
        res.status(500).send("Error fetching paintings");
    }
});

// Get the painting info from a specific painting ID
router.get("/painting/:paintingId", async (req, res) => {
    const paintingId = req.params.paintingId
    try {
        const painting = await dbGet(`SELECT * FROM paintings WHERE painting_id = ?`, paintingId)
        if (painting) {
            res.status(200).json(painting)
        }
        else {
            res.status(404).send(`Painting with painting ID ${paintingId} not found`)
        }
    }
    catch (error) {
        console.error(`Error fetching painting with painting ID ${paintingId}:`, error)
        res.status(500).send("Error fetching painting")
    }
})

// Get all the images for a specific painting ID
router.get("/painting/images/:paintingId", async (req, res) => {
    const paintingId = req.params.paintingId;
    try {
        const imagesInBlob = await dbAll(`SELECT data FROM images WHERE painting_id = ?`, paintingId);
        
        // Set the appropriate Content-Type header for the response
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });

        // Write all images to the response
        imagesInBlob.forEach((image) => {
            res.write(image.data, 'binary'); // Write the image data
        });

        res.end(); // End response after writing all images
    } catch (error) {
        console.error(`Error fetching images with painting ID ${paintingId}:`, error);
        res.status(500).send("Error fetching images");
    }
});



export default { router, requireAuth }
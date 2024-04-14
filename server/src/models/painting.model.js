import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid'

import db from '../db.js'

const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db))

class Painting {
    constructor(name, price, image, userId) {
        this.paintingId = uuidv4()
        this.name = name
        this.price = price
        this.likes = 0
        this.imageBuffer = image
        this.userId = userId
    }

    async save() {
        try {
            await dbRun(`INSERT INTO paintings (painting_id, name, price, likes, image, user_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [this.paintingId, this.name, this.price, this.likes, this.imageBuffer, this.userId])
            console.log("Painting saved successfully")
        }
        catch (error) {
            console.error("Error saving painting", error)
        }
    }

    async like(paintingId, userId) {
        try {
            // Check if trying to like their own painting
            const myOwnPaintings = await dbGet(
                `SELECT * FROM paintings WHERE painting_id = ? AND user_id = ?`,
                [paintingId, userId]
            );
    
            // Check if user already liked this painting
            const alreadyLiked = await dbGet(
                `SELECT * FROM user_likes WHERE user_id = ? AND painting_id = ?`,
                [userId, paintingId]
            );
    
            if (myOwnPaintings) {
                return { success: false, message: "Could not like your own painting" };
            }
    
            if (alreadyLiked) {
                return { success: false, message: "You have already liked this painting" };
            }
    
            // Insert the like in the user_likes table, mapping userId and paintingId
            await dbRun(
                `INSERT INTO user_likes (user_id, painting_id) VALUES (?, ?)`,
                [userId, paintingId]
            );
    
            // Update the likes count in the paintings table
            await dbRun(
                `UPDATE paintings SET likes = likes + 1 WHERE painting_id = ?`,
                paintingId
            );
    
            // Fetch the updated likes count
            const likes = await dbGet(
                `SELECT likes FROM paintings WHERE painting_id = ?`,
                paintingId
            );
    
            this.likes = likes
            return { success: true, likes: this.likes };
        } catch (error) {
            console.error("Error liking painting:", error);
            return { success: false, message: "Internal Server Error" };
        }
    }

    static async getAllPaintingsWithDetails() {
        try {
          const paintings = await dbAll(`SELECT * FROM paintings`);
    
          const updatedPaintings = await Promise.all(paintings.map(async (painting) => {
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
              username: createdBy ? createdBy.username : null,
              featuredImageData: featuredImage ? featuredImage.data : null,
            };
          }));
    
          return updatedPaintings;
        } catch (error) {
          console.error("Error fetching all paintings with details:", error);
          throw error; // Re-throw the error to handle it in the router
        }
    }
    
    static async getImagesByPaintingId(paintingId, res) {
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
    }

    static async findByUserId(userId) {
        try {
            const paintings = dbGet(`SELECT * FROM paintings WHERE user_id = ?`, userId)
            return paintings
        }
        catch (error) {
            console.error("Error fetching paintings", error)
            return []
        }
    }

    static async findById(paintingId) {
        try {
            const painting = await dbGet(`SELECT * FROM paintings WHERE painting_id = ?`, paintingId)
            return painting
        }
        catch (error) {
            console.error("Error fetching painting:", error)
            return null
        }
    }
}

export default Painting
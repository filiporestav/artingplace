import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid'

import db from '../db.js'

const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db))

class Painting {
    constructor(name, price, description, image, userId) {
        this.paintingId = uuidv4()
        this.name = name
        this.price = price
        this.likes = 0
        this.description = description
        this.imageBuffer = image
        this.posted = 0
        this.userId = userId
    }

    async save() {
        try {
            await dbRun(`INSERT INTO paintings (painting_id, name, price, likes, description, image, posted, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.paintingId, this.name, this.price, this.likes, this.description, this.imageBuffer, this.posted, this.userId])
            console.log("Painting saved successfully")
        }
        catch (error) {
            console.error("Error saving painting", error)
        }
    }

    // Update the painting
    static async updateInfo(paintingId, userId, name, price, description, image) {
        try {
            await dbRun(`
                UPDATE paintings 
                SET name = ?, price = ?, description = ?, image = ?
                WHERE painting_id = ? AND user_id = ?
            `,
            [name, price, description, image, paintingId, userId]);
            console.log("Painting updated successfully");
        }
        catch (error) {
            console.error("Error updating painting", error);
        }
    }

    static async post(paintingId) {
        try {
            await dbRun(`UPDATE paintings SET posted = TRUE WHERE painting_id = ?`, [paintingId])
            console.log("Painting set posted")
        }
        catch(error) {
            console.error("Error posting painting with painting ID:", paintingId)
        }
    }

    static async getImageData(paintingId) {
        const imageData = dbGet(`SELECT image FROM paintings WHERE painting_id = ?`, paintingId)
        return imageData
    }

    static async like(paintingId, userId) {
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
            return { success: true, message: `Successfully liked painting with id ${paintingId}` };
        } catch (error) {
            console.error("Error liking painting:", error);
            return { success: false, message: "Internal Server Error" };
        }
    }

    static async getPaintings() {
        try {
            const paintings = await dbAll(`SELECT * FROM paintings WHERE posted = 1`) // Just return posted paintings
            return paintings
        }
        catch (error) {
            console.error("Error fetching paintings", error)
            return []
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

    // Default to check for posted, second argument can be changed to 0 if only unposted painting
    static async findById(paintingId, posted=1) {
        try {
            const painting = dbGet(`SELECT * FROM paintings WHERE painting_id = ? AND posted = ?`, paintingId, posted)
            return painting
        }
        catch (error) {
            console.error("Error fetching paintings", error)
            return []
        }
    }

}

export default Painting
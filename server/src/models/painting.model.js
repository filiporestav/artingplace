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
            const paintings = await dbAll(`SELECT * FROM paintings`)
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

    static async findById(paintingId) {
        try {
            const painting = dbGet(`SELECT * FROM paintings WHERE painting_id = ?`, paintingId)
            return painting
        }
        catch (error) {
            console.error("Error fetching paintings", error)
            return []
        }
    }
}

export default Painting
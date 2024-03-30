import { Router } from 'express'
import model from '../model.js'
import db from '../db.js'

const router = Router()

router.post("/upload", async (req, res) => {
    const files = req.files
    console.log(files)
    /*
    const addStatement = "INSERT INTO images (name, data) VALUES (?, ?)"
    db.run(addStatement, [name, data] (err) => {
        if (err) {
            console.log("Error adding the image to the database")
            res.sendStatus(200)
        }
        else { 
            console.log("Successfully added the image to the database")
            res.sendStatus(400)
        }
    })
    */
})
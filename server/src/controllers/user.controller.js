import { Router } from 'express'
import model from '../model.js'

const router = Router()

/**
 * requireAuth is a middleware function that limit access to an endpoint to authenticated users.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
    const { id } = req.session
    const user = model.findUserById(id)
    console.log("User found with ID: ", id)
    console.log("User found: ", user)

    if (!user && req.startsWith("/api")) {
        res.status(401).end()
    }
    else {
        next()
    }
}

router.post("/login", (req, res) => {
    const { username, password } = req.body
    console.log(req.body)
    res.status(200).send({username, password})

})

router.post("/logout", (req, res) => {
    const { id } = req.session
    console.log(id)
})

export default { router, requireAuth }
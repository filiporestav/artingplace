import express from "express";
import session from 'express-session'
import { createServer } from 'http'
import user from './controllers/user.controller.js'
import { Server } from 'socket.io'
import model from './model.js'
import morgan from 'morgan'
import path from 'path'

const port = process.env.PORT || 8989;
const app = express(); // Build an express server
const server = createServer(app)
const io = new Server(server)

const sessionMiddleware = session({
    secret: 'mySecret',
    resave: true,
    saveUninitialized: true,
})

// Setup middleware for express
app.use(sessionMiddleware)

// Share the session context from express with the Socket.IO server
// read more here https://socket.io/how-to/use-with-express-session
io.engine.use(sessionMiddleware)

// Logger
app.use(morgan('combined'))

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Register middlewares that parse the body of the request, available under req.body property
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Bind REST controllers to /api/*
app.use("/api", user.router)

// Init the model with the socket instance
model.init(io)

io.on("connection", (socket) => {
    console.log("Client connected to socket!")

    socket.on("disconnect", () => {
        console.log("Client disconnected from socket!")
    })
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
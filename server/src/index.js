import express from "express";
import session from 'express-session'
import { createServer } from 'http'
import user from './controllers/user.controller.js'
import painting from './controllers/painting.controller.js'
import { Server } from 'socket.io'
import model from './model.js'
import morgan from 'morgan'
import { resolvePath } from "./util.js"
import betterLogging from 'better-logging'
import db from './db.js'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const port = process.env.PORT || 8989;
const app = express(); // Build an express server
const server = createServer(app)
const io = new Server(server)

const { Theme } = betterLogging;
betterLogging(console, {
    color: Theme.green,
})

console.logLevel = 4; // Enable all logging

// Register custom middleware for logging incoming requests
app.use(
    betterLogging.expressMiddleware(console, {
        ip: { show: true, color: Theme.green.base },
        method: { show: true, color: Theme.green.base },
        header: { show: false },
        path: { show: true },
        body: { show: true },
    })
)

const sessionMiddleware = session({
    secret: 'mySecret',
    resave: true,
    saveUninitialized: true,
})

// Setup middleware for express
app.use(sessionMiddleware)

// Used to parse cookies
app.use(cookieParser())

// Enable Helmet Express middleware for security
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "img-src": ["'self'", "blob:" ,"data:"], // Allow img-sources from BLOB urls
        },
      },
    })
  );

// Share the session context from express with the Socket.IO server
// read more here https://socket.io/how-to/use-with-express-session
io.engine.use(sessionMiddleware)

// Logger
app.use(morgan('combined'))

// Serve static files
// app.use(express.static(resolvePath("client", "dist")));
app.use(express.static(resolvePath('client', 'dist')))

// Register middlewares that parse the body of the request, available under req.body property
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Bind REST controllers to /api/*
app.use("/api", user.router)
app.use("/api", painting.router)

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
import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";
import { Server } from "socket.io";
import morgan from "morgan";
import betterLogging from "better-logging";

import user from "./controllers/user.controller.js";
import painting from "./controllers/painting.controller.js";
import { resolvePath } from "./util.js";

const port = process.env.PORT || 8989;
const app = express(); // Build an express server
const server = createServer(app);
const io = new Server(server);

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

console.logLevel = 4; // Enable all logging

// Register custom middleware for logging incoming requests
app.use(
  betterLogging.expressMiddleware(console, {
    ip: { show: true, color: Theme.green.base },
    method: { show: true, color: Theme.green.base },
    header: { show: false },
    path: { show: true },
    body: { show: true },
  }),
);

// Configure session management
const sessionConf = expressSession({
  secret: "Super secret! Shh! Do not tell anyone...",
  resave: true,
  saveUninitialized: true,
});

app.use(sessionConf);
io.use(
  socketIOSession(sessionConf, {
    autoSave: true,
    saveUninitialized: true,
  }),
);

// Used to parse cookies
app.use(cookieParser());

// Enable Helmet Express middleware for security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "blob:", "data:"], // Allow img-sources from BLOB urls
      },
    },
  }),
);

// Share the session context from express with the Socket.IO server
// read more here https://socket.io/how-to/use-with-express-session
io.engine.use(sessionConf);

// Logger
app.use(morgan("combined"));

// Serve static files
// app.use(express.static(resolvePath("client", "dist")));
app.use(express.static(resolvePath("client", "dist")));

// Register middlewares that parse the body of the request, available under req.body property
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bind REST controllers to /api/*
app.use("/api", user.router);
app.use("/api", painting.router);

io.on("connection", (socket) => {
  console.log("Client connected to socket!");
  socket.emit("connection", "Client connected to socket!");

  socket.on("disconnect", () => {
    console.log("Client disconnected from socket!");
  });

  // Client emits that a painting has been changed, server listens and emits the new paintings to all clients
  socket.on("paintingsChanged", (paintings) => {
    io.emit("updatePaintingList", paintings);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

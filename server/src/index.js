import express from "express";
import { createServer } from "https";
import fs from 'fs' // Read from file
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";
import { Server } from "socket.io";
import morgan from "morgan";
import betterLogging from "better-logging";
import history from "connect-history-api-fallback";

import user from "./controllers/user.controller.js";
import Painting from "./models/painting.model.js";
import painting from "./controllers/painting.controller.js";
import { resolvePath } from "./util.js";

const port = process.env.PORT || 8989;
const app = express(); // Build an express server

// SSL certificate options
const options = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
}
const server = createServer(options, app);
const io = new Server(server);

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

console.logLevel = 4; // Enable all logging

// History API Fallback
app.use(
  history({
    htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
  }),
);

// Session Configuration
const sessionConf = expressSession({
  secret: "Super secret! Shh! Do not tell anyone...",
  resave: true,
  saveUninitialized: true,
});
app.use(sessionConf);

// Cookie Parser
app.use(cookieParser());

app.use(helmet())

// Logging
app.use(morgan("combined"));

// Serve Static Files
app.use(express.static(resolvePath("client", "dist")));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST Controllers
app.use("/api", user.router);
app.use("/api", painting.router);

// Socket.IO Configuration
io.use(
  socketIOSession(sessionConf, {
    autoSave: true,
  }),
);

io.on("connection", async (socket) => {
  console.log("Client connected to socket!");

  socket.on("disconnect", () => {
    console.log("Client disconnected from socket!");
  });

  // Express socket io session
  socket.on("login", (userData) => {
    const skt = socket;
    skt.handshake.session.user = userData;
    console.log("Session saved in socket");
  });

  // Delete socket io session
  socket.on("logout", () => {
    const skt = socket;
    if (skt.handshake.session.user) {
      delete skt.handshake.session.user;
      console.log("Session deleted in socket");
    }
  });

  // Called when client is updating painting
  socket.on("paintingsChanged", async () => {
    const allPaintings = await Painting.getPaintings();
    io.emit("updatePaintingList", allPaintings);
  });

  // Inactivity timer
  let timer = null;
  socket.on("activity", () => {
    clearTimeout(timer); // Clear timer before restarting it
    const skt = socket;
    if (skt.handshake.session.user) {
      timer = setTimeout(() => {
        delete skt.handshake.session.user;
        console.log("Session deleted in socket due to inactivity");
        // Also need to remove 'niceCookie' here
        skt.emit("loggedOut");
      }, 30000); // 30 sec inactivity timeout
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

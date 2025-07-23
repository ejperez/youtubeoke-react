const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);

app.use(cors());
dotenv.config();

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET"],
  },
});

const apiKey = process.env.YOUTUBE_DATA_API_KEY || false;
const maxResults = process.env.YOUTUBE_DATA_API_MAX_RESULTS || 50;

// Serve React static files in production
app.use(express.static(path.join(__dirname, "../client/dist")));

// Endpoint for searching YouTube
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

app.get("/api/search/:q", limiter, async (req, res) => {
  if (!apiKey) {
    res.sendStatus(500);
  }

  const q = encodeURIComponent(req.params.q);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${q}&type=video&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  res.send(data);
});

// Web Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sync-event", (data) => {
    socket.broadcast.emit("sync-event", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

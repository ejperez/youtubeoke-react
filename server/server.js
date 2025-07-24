const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const youtubesearchapi = require("youtube-search-api");

const app = express();
const server = http.createServer(app);

app.use(cors());
dotenv.config();

console.log("Allowed origins", process.env.ALLOWED_ORIGINS || "*");

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET"],
  },
});

// Endpoint for searching YouTube
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

app.get("/", (_, res) => {
  res.send({
    status: "up",
    datetime: new Date(),
  });
});

app.get("/api/search/:q", limiter, async (req, res) => {
  const data = await youtubesearchapi.GetListByKeyword(
    req.params.q,
    false,
    100,
    [{ type: "video" }]
  );

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

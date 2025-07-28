const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const youtubesearchapi = require("youtube-search-api");

const app = express();
const server = http.createServer(app);

dotenv.config();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || "*",
  methods: ["GET"],
};

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

app.use(express.json());

const io = new Server(server, { cors: corsOptions });

// Endpoints for searching YouTube
const LIMIT = 100;
const blockedChannels = process.env.BLOCKED_CHANNELS || [];

const filterVideos = (items) => {
  return items
    .filter((item) => item.type === "video")
    .filter((item) => !blockedChannels.includes(item.channelTitle));
};

const processResponse = (data, res) => {
  const items = [...filterVideos(data.items)];

  res.send({
    items: items,
    nextPage: data?.nextPage,
  });
};

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
    LIMIT,
    [{ type: "video" }]
  );

  return processResponse(data, res);
});

app.post("/api/search/nextPage", limiter, async (req, res) => {
  const data = await youtubesearchapi.NextPage(req.body.nextPage, false, LIMIT);

  return processResponse(data, res);
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

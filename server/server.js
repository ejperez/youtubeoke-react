const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const youtubesearchapi = require("youtube-search-api");
const { readFileSync } = require("fs");

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

app.use(limiter);

const io = new Server(server, { cors: corsOptions });

// Endpoint for searching YouTube
app.get("/", (_, res) => {
  res.send({
    status: "up",
    datetime: new Date(),
  });
});

const LIMIT = 100;
const filterVideos = (items) => {
  return items.filter((item) => item.type === "video");
};

app.get("/api/search/:q", limiter, async (req, res) => {
  const data = await youtubesearchapi.GetListByKeyword(
    req.params.q,
    false,
    LIMIT,
    [{ type: "video" }]
  );

  const items = [...filterVideos(data.items)];
  let hasNextPage = "nextPage" in data;
  let currentData = data;

  while (hasNextPage && items.length < LIMIT) {
    const nextData = await youtubesearchapi.NextPage(currentData.nextPage);

    if (!Array.isArray(nextData.items)) {
      break;
    }

    filterVideos(nextData.items).forEach((item) => {
      items.push(item);
    });

    hasNextPage = "nextPage" in nextData;
    currentData = nextData;
  }

  res.send(items);
});

app.get("/test/api/search/:q", async (_, res) => {
  const items = readFileSync("sample.json");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  res.send(items);
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

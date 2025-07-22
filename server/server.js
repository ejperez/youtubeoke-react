const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Use specific origin in production
    methods: ["GET"],
  },
});

app.use(cors());

// Serve React static files in production
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get(/(.*)/, (_, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
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

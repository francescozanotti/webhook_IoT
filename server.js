const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

// Handle TTN webhook
app.post("/ttn-webhook", (req, res) => {
  console.log("Received data:", req.body);
  
  // Extract sensor data
  const sensorData = req.body; 

  // Broadcast to connected clients
  io.emit("sensor-data", sensorData);

  res.status(200).send("Data received");
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PORT = 3001;
const ALLOWED_ORIGIN = "http://localhost:3000";

const express = require("express");
const app = express();

const connectDb = require("./src/connection");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const userRouter = require("./src/controllers/user");

const io = new Server(server, {
  cors: ALLOWED_ORIGIN,
  serveClient: false,
});

const cors = require("cors");
app.use(cors());

app.use("/user", userRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send data", () => {
    console.log("send data");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);

  connectDb().then(() => {
    console.log("MongoDb connected");
  });
});

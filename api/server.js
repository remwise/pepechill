const PORT = 3001;
const ALLOWED_ORIGIN = "http://localhost:3000";

const express = require("express");
const app = express();
// const connectDb = require("./src/connection");
// const User = require("./src/models/User.model");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: ALLOWED_ORIGIN,
  serveClient: false,
});

const cors = require("cors");
app.use(cors());

// app.get("/users", async (req, res) => {
//   const users = await User.find();

//   res.json(users);
// });

// app.get("/user-create", async (req, res) => {
//   const user = new User({ username: "userTest" });

//   await user.save().then(() => console.log("User created"));

//   res.send("User created \n");
// });

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

  // connectDb().then(() => {
  //   console.log("MongoDb connected");
  // });
});

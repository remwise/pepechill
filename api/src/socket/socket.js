const { exec } = require("child_process");

const socketExecute = (socket) => {
  console.log("a user connected");

  socket.on("send data", (base64) => {
    console.log("send data");
    exec(`python ../../../ml/main.py ${base64}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

module.exports = socketExecute;

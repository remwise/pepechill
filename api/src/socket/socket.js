const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const ensureDirectoryExistence = (filePath) => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

const socketExecute = (socket) => {
  console.log("a user connected");
  const socketId = socket.id;
  const imageBasePath = `assets/${socketId}.jpg`;
  const resultBasePath = `results/${socketId}.txt`;
  const imagePath = `ml/assets/${socketId}.jpg`;
  const resultPath = `ml/results/${socketId}.txt`;

  //   ensureDirectoryExistence(imagePath)
  //   fs.writeFileSync(imagePath, "", () => {});
  //   ensureDirectoryExistence(resultPath)
  //   fs.writeFileSync(resultPath, "", () => {});

  //   fs.watchFile(resultPath, { interval: 1000 }, (curr, prev) => {
  //     console.log(`${resultPath} file Changed`);

  //     const text = fs.readFileSync(resultPath).toString();
  //     console.log("text :>> ", text);
  //   });
  // ! add workout
  // exec(`python ../../ml/main.py ${imageBasePath} ${resultBasePath} ${}`);

  socket.on("send data", ({ data }) => {
    console.log("send data");
    fs.writeFile(`ml/assets/${socketId}.jpeg`, data, () => {});
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // fs.unlink(imagePath, () => {});
    // fs.unlink(resultPath, () => {});
  });
};

module.exports = socketExecute;
